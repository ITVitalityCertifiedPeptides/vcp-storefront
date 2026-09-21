// Hourly payment-reminder sweep (2026-09-21). Vercel Cron hits this on the
// schedule in vercel.json. For every unpaid, non-draft, non-canceled retail
// or Inner Circle order placed in the last 72 hours it sends the reminder
// stage that's due (4h, 12h, 48h after placement; lib/payment-reminder-
// email.ts) and stamps metadata.payment_reminders.<stage> so nothing goes
// out twice. Wholesale orders are skipped (invoiced by the wholesale app).
//
// Auth: Vercel sends `Authorization: Bearer <CRON_SECRET>` (set CRON_SECRET
// in Vercel env). For a manual run, ?token=<SWELL_WEBHOOK_SECRET> works too:
//   curl "https://www.vitalitycertifiedpeptides.com/api/cron/payment-reminders?token=..."
// Add ?dry=1 to see what would be sent without sending.

import type { SwellOrder } from "@/lib/swell-backend-notify";
import { customerEmailFor } from "@/lib/swell-backend-notify";
import { sendEmail } from "@/lib/resend";
import { REMINDER_STAGES, buildPaymentReminderHtml, buildPaymentReminderText } from "@/lib/payment-reminder-email";
import { wantsWireAttachment } from "@/lib/payment-instructions";
import { wireAttachment } from "@/lib/wire-instructions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LOOKBACK_HOURS = 72;

function auth(): string {
  const storeId = process.env.NEXT_PUBLIC_SWELL_STORE_ID || process.env.SWELL_STORE_ID;
  const secret = process.env.SWELL_SECRET_KEY;
  if (!storeId || !secret) throw new Error("Swell credentials not configured");
  return `Basic ${Buffer.from(`${storeId}:${secret}`).toString("base64")}`;
}

async function swell<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`https://api.swell.store${path}`, {
    method,
    headers: { Authorization: auth(), "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Swell ${method} ${path} -> ${res.status}`);
  return (await res.json()) as T;
}

function authorized(request: Request): boolean {
  const cron = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") || "";
  if (cron && header === `Bearer ${cron}`) return true;
  const token = new URL(request.url).searchParams.get("token");
  const hook = process.env.SWELL_WEBHOOK_SECRET;
  return Boolean(token && hook && token === hook);
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const dry = new URL(request.url).searchParams.get("dry") === "1";
  const now = Date.now();
  const since = new Date(now - LOOKBACK_HOURS * 3600_000).toISOString();

  const list = await swell<{ results?: SwellOrder[] }>(
    "GET",
    `/orders?where[paid][$ne]=true&where[canceled][$ne]=true&where[draft][$ne]=true&where[date_created][$gte]=${encodeURIComponent(since)}&expand=account&limit=100&sort=date_created%20asc`
  );
  const orders = list.results ?? [];
  const report: Array<Record<string, unknown>> = [];

  for (const order of orders) {
    const number = order.number ? String(order.number) : order.id;
    const group = (order.account?.group || "").toLowerCase();
    if (group === "wholesale") { report.push({ number, skipped: "wholesale" }); continue; }
    const email = customerEmailFor(order);
    if (!email) { report.push({ number, skipped: "no email" }); continue; }
    const created = order.date_created ? new Date(order.date_created).getTime() : NaN;
    if (!Number.isFinite(created)) { report.push({ number, skipped: "no date" }); continue; }
    const ageHours = (now - created) / 3600_000;
    const sent = ((order.metadata?.payment_reminders as Record<string, string> | undefined) ?? {});
    // Highest stage that is due and not yet sent. Only one email per sweep.
    const due = [...REMINDER_STAGES].reverse().find((s) => ageHours >= s.hours && !sent[s.key]);
    if (!due) { report.push({ number, ageHours: Math.round(ageHours * 10) / 10, skipped: "nothing due" }); continue; }

    if (!dry) {
      try {
        await sendEmail({
          to: email,
          subject: due.subject(number),
          html: buildPaymentReminderHtml(order, due),
          text: buildPaymentReminderText(order, due),
          attachments: wantsWireAttachment(order) ? [wireAttachment()] : undefined,
        });
        // Mark this stage and every earlier one so a late first run doesn't
        // follow up with the older reminders afterwards.
        const stamp = new Date().toISOString();
        const set: Record<string, string> = {};
        for (const s of REMINDER_STAGES) if (s.hours <= due.hours && !sent[s.key]) set[`metadata.payment_reminders.${s.key}`] = stamp;
        await swell("PUT", `/orders/${order.id}`, {
          $set: set,
          comments: `${order.comments || ""}\n[${stamp.slice(0, 10)}] Payment reminder (${due.key}) emailed to ${email}.`.trim(),
        });
      } catch (err) {
        console.error(`payment reminder ${due.key} for #${number} failed`, err);
        report.push({ number, stage: due.key, error: String((err as Error)?.message || err) });
        continue;
      }
    }
    report.push({ number, stage: due.key, to: email, ageHours: Math.round(ageHours * 10) / 10, sent: !dry });
  }

  return Response.json({ ok: true, dry, checked: orders.length, report });
}
