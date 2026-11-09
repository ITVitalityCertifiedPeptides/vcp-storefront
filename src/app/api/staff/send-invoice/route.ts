// Staff portal "Send invoice": looks up an order by number (GET) and emails
// the customer the full invoice with every pay link and QR code (POST).
// Replaces Swell's own "Send invoice" button, which sends from Swell's
// servers and fails this domain's DMARC (Microsoft shows an impersonation
// warning). This goes out through Resend, which is authenticated.

import { NextResponse } from "next/server";
import { currentStaff } from "@/lib/staff-portal-auth";
import { customerEmailFor, formatCurrency, type SwellOrder } from "@/lib/swell-backend-notify";
import { buildInvoiceEmail } from "@/lib/invoice-email";
import { sendEmail } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

async function findOrder(orderNumber: string): Promise<SwellOrder | null> {
  const list = await swell<{ results?: SwellOrder[] }>(
    "GET",
    `/orders?where[number]=${encodeURIComponent(orderNumber)}&limit=1&expand=account`
  );
  return list.results?.[0] ?? null;
}

function summary(order: SwellOrder) {
  const currency = order.currency || "USD";
  const name = [order.account?.first_name, order.account?.last_name].filter(Boolean).join(" ") || order.account?.name || "";
  return {
    number: order.number ? String(order.number) : order.id,
    customer: name,
    email: customerEmailFor(order) ?? null,
    total: formatCurrency(order.grand_total, currency),
    items: (order.items ?? []).map((i) => `${i.quantity ?? 1} x ${i.product_name ?? "Item"}`),
    paid: Boolean(order.paid),
    canceled: Boolean(order.canceled),
  };
}

function cleanNumber(raw: unknown): string | null {
  const n = String(raw ?? "").replace(/[^0-9]/g, "");
  return n.length >= 4 && n.length <= 10 ? n : null;
}

export async function GET(req: Request) {
  const staff = await currentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const number = cleanNumber(new URL(req.url).searchParams.get("orderNumber"));
  if (!number) return NextResponse.json({ ok: false, message: "Enter the order number." }, { status: 400 });
  try {
    const order = await findOrder(number);
    if (!order) return NextResponse.json({ ok: false, message: `No order #${number} found.` }, { status: 404 });
    return NextResponse.json({ ok: true, order: summary(order) });
  } catch (e) {
    console.error("staff send-invoice lookup failed", e);
    return NextResponse.json({ ok: false, message: "Couldn't reach Swell. Try again." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const staff = await currentStaff();
  if (!staff) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  let raw: Record<string, unknown> = {};
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Bad request" }, { status: 400 });
  }
  const number = cleanNumber(raw.orderNumber);
  if (!number) return NextResponse.json({ ok: false, message: "Enter the order number." }, { status: 400 });
  try {
    const order = await findOrder(number);
    if (!order) return NextResponse.json({ ok: false, message: `No order #${number} found.` }, { status: 404 });
    if (order.canceled) return NextResponse.json({ ok: false, message: `Order #${number} is canceled.` }, { status: 409 });
    if (order.paid) return NextResponse.json({ ok: false, message: `Order #${number} is already paid.` }, { status: 409 });
    const email = customerEmailFor(order);
    if (!email) return NextResponse.json({ ok: false, message: `Order #${number} has no customer email.` }, { status: 409 });

    const { subject, html, text } = buildInvoiceEmail(order);
    await sendEmail({ to: email, subject, html, text });

    // Leave a trail on the order so the team can see who sent it and when.
    try {
      const stamp = new Date().toISOString().slice(0, 10);
      const note = `[${stamp}] Invoice emailed to ${email} by ${staff.name} (staff portal).`;
      await swell("PUT", `/orders/${order.id}`, { comments: order.comments ? `${order.comments}\n${note}` : note });
    } catch (e) {
      console.error("staff send-invoice: could not add order note", e);
    }

    return NextResponse.json({ ok: true, order: summary(order) });
  } catch (e) {
    console.error("staff send-invoice failed", e);
    return NextResponse.json({ ok: false, message: "Something went wrong. The invoice may not have been sent." }, { status: 500 });
  }
}
