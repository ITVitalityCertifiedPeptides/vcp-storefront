// Receives Swell's account-created webhook and sends a branded welcome
// email via Resend, replacing Swell's native "Customer welcome" send (see
// the root-cause writeup at the top of swell-backend-notify.ts - every
// native Swell notification fails this domain's SPF/DMARC policy).
//
// SKIPS Inner Circle and Wholesale signups on purpose - see the header
// comment in account-welcome-email.ts. Those two apps already send their
// own tailored applicant-welcome email from their own server-side
// registration routes; this route only fires the generic retail welcome
// for accounts NOT in "pending" (Circle/Wholesale applicants both start
// pending), "friends-family", or "wholesale".
//
// CONFIDENCE NOTE: unlike order.created/order.paid (proven working since
// 2026-08-21/09-01), there's no confirmed test delivery yet for whatever
// Swell calls its account/customer-creation event - try "Account Created"
// or "Customer Created" in the Developer > Webhooks event picker, and check
// the "model"/"type" fields on a real test payload if this doesn't fire.
//
// Setup in Swell admin (Developer > Webhooks): URL =
// .../api/webhooks/swell-account-created?token=<SWELL_WEBHOOK_SECRET>
// Once confirmed delivering for a genuine retail signup, disable Swell's
// native "Customer welcome" notification (Settings > Notifications).

import {
  checkAuth,
  fetchAccount,
  type SwellWebhookBody,
} from "@/lib/swell-backend-notify";
import { buildAccountWelcomeEmailHtml, buildAccountWelcomeEmailText } from "@/lib/account-welcome-email";
import { sendEmail } from "@/lib/resend";

const SKIP_GROUPS = new Set(["pending", "friends-family", "wholesale"]);

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SwellWebhookBody;
  try {
    body = (await request.json()) as SwellWebhookBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const accountId = body?.data?.account_id || body?.data?.id;
  if (!accountId) {
    return Response.json({ error: "Missing account id in payload" }, { status: 400 });
  }

  try {
    const account = await fetchAccount(accountId);
    const group = (account.group || "").toLowerCase();

    if (SKIP_GROUPS.has(group)) {
      return Response.json({ ok: true, skipped: `group "${group}" has its own welcome email` });
    }

    if (!account.email) {
      // No team-alert fallback here (unlike orders) - a customer record
      // with no email isn't a transaction anyone needs to chase down.
      return Response.json({ ok: true, skipped: "no email on account" });
    }

    const firstName = account.first_name || "";
    await sendEmail({
      to: account.email,
      subject: "Welcome to Vitality Certified Peptides",
      html: buildAccountWelcomeEmailHtml(firstName),
      text: buildAccountWelcomeEmailText(firstName),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-account-created webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
