// Receives Swell's `order.paid` webhook (Settings > Developer > Webhooks,
// alias "payment-received-email", registered 2026-08-21) and sends the
// "Payment received / processing" email via Resend - the automated version
// of Template 3 in claude/Invoice Email Template.md, sent the moment staff
// click "Charge order" in the Swell admin (that's what flips an order to
// paid and is what fires this event).
//
// Swell's webhook payload only carries {id, model, type, data: {id}} - the
// order id, not the order itself - so this fetches the full order from the
// Backend API before emailing. See https://developers.swell.is/backend-api/webhooks
//
// Auth: Swell webhooks have no signature/HMAC support (per their docs, only
// a source-IP allowlist, which is brittle behind Vercel's edge network), so
// this is protected instead by a shared-secret `token` query param baked
// into the webhook URL itself. Set SWELL_WEBHOOK_SECRET in Vercel to the
// same value used in the webhook URL.
//
// Required Vercel env vars: SWELL_WEBHOOK_SECRET, SWELL_SECRET_KEY
// (already set for the /api/subscribe route), NEXT_PUBLIC_SWELL_STORE_ID
// (already set), RESEND_API_KEY, RESEND_FROM_EMAIL (optional).
//
// Known limitation: no idempotency guard yet. If Swell retries a delivery
// (e.g. our endpoint times out after sending but before returning 200) the
// email could send twice for the same order. Low risk in practice - add an
// `payment_email_sent` custom field on the Order content model (Developer >
// Models, same pattern already used for Product's category/cas_number/
// ruo_disclaimer fields) and check/set it here if duplicates become a
// real problem.

import { sendEmail } from "@/lib/resend";

type SwellWebhookBody = {
  type?: string;
  model?: string;
  data?: { id?: string };
};

type SwellOrder = {
  id: string;
  number?: string | number;
  email?: string;
  account?: { email?: string };
  billing?: { email?: string };
  shipping?: { email?: string; name?: string };
  grand_total?: number;
  currency?: string;
  date_created?: string;
};

function formatCurrency(amount: number | undefined, currency = "USD") {
  if (typeof amount !== "number") return "";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

async function fetchOrder(orderId: string): Promise<SwellOrder> {
  const storeId = process.env.NEXT_PUBLIC_SWELL_STORE_ID;
  const secretKey = process.env.SWELL_SECRET_KEY;
  if (!storeId || !secretKey) {
    throw new Error("SWELL_SECRET_KEY / NEXT_PUBLIC_SWELL_STORE_ID not configured");
  }
  const auth = Buffer.from(`${storeId}:${secretKey}`).toString("base64");
  const res = await fetch(`https://api.swell.store/orders/${orderId}`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch order ${orderId}: ${res.status}`);
  }
  return (await res.json()) as SwellOrder;
}

function buildEmail(order: SwellOrder) {
  const number = order.number ? String(order.number) : order.id;
  const total = formatCurrency(order.grand_total, order.currency || "USD");
  const subject = `Payment received - order #${number} is being processed`;
  const text = `Hi,

We've received your payment for order #${number}${total ? ` (${total})` : ""}. Your order is now being processed.

Our team reviews and approves orders Monday through Friday during business hours, and your order ships within 1 business day of approval. You'll get a separate email with tracking and your Certificate of Analysis once it ships.

Thank you,
Vitality Certified Peptides`;
  const html = `<p>Hi,</p>
<p>We've received your payment for order <strong>#${number}</strong>${total ? ` (${total})` : ""}. Your order is now being processed.</p>
<p>Our team reviews and approves orders Monday through Friday during business hours, and your order ships within 1 business day of approval. You'll get a separate email with tracking and your Certificate of Analysis once it ships.</p>
<p>Thank you,<br/>Vitality Certified Peptides</p>`;
  return { subject, text, html };
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const expected = process.env.SWELL_WEBHOOK_SECRET;

  if (!expected || token !== expected) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SwellWebhookBody;
  try {
    body = (await request.json()) as SwellWebhookBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = body?.data?.id;
  if (!orderId) {
    return Response.json({ error: "Missing order id in payload" }, { status: 400 });
  }

  try {
    const order = await fetchOrder(orderId);
    const customerEmail =
      order.email || order.account?.email || order.billing?.email || order.shipping?.email;

    const { subject, text, html } = buildEmail(order);

    if (customerEmail) {
      await sendEmail({ to: customerEmail, subject, html, text });
    } else {
      // No resolvable customer email - alert the team instead of silently
      // dropping the notification, so a human sends it manually.
      await sendEmail({
        to: "customerservice@vitalitycertifiedpeptides.com",
        subject: `[Action needed] No email on file for paid order #${order.number ?? order.id}`,
        text: `Order ${order.number ?? order.id} was marked paid but no customer email was found on the order record. Please send the payment-received email manually (see Invoice Email Template.md, Template 3).`,
        html: `<p>Order <strong>${order.number ?? order.id}</strong> was marked paid but no customer email was found on the order record. Please send the payment-received email manually (see Invoice Email Template.md, Template 3).</p>`,
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-order-paid webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
