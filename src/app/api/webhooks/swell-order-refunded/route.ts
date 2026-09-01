// Receives Swell's order-refunded webhook and sends the "Order refunded"
// email via Resend. Same root-cause/fix writeup as swell-order-created - see
// the comment at the top of that file and src/lib/swell-backend-notify.ts.
//
// Setup in Swell admin (Developer > Webhooks): event = whatever the picker
// calls it (try "Order Refunded" - if there's also a separate "Refund
// Created" event tied to a Refunds resource rather than the Order itself,
// that one's payload id may not be the order id; check what "model" comes
// through on a real test delivery and adjust the fetch below if needed).
// URL = .../api/webhooks/swell-order-refunded?token=<SWELL_WEBHOOK_SECRET>
// Once confirmed delivering, disable Swell's native "Order refunded"
// notification (Settings > Notifications).

import {
  checkAuth,
  fetchOrder,
  formatCurrency,
  customerEmailFor,
  wrapEmailHtml,
  alertTeamNoEmail,
  type SwellWebhookBody,
} from "@/lib/swell-backend-notify";
import { sendEmail } from "@/lib/resend";

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

  const orderId = body?.data?.id;
  if (!orderId) {
    return Response.json({ error: "Missing order id in payload" }, { status: 400 });
  }

  try {
    const order = await fetchOrder(orderId);
    const number = order.number ? String(order.number) : order.id;
    const refundAmount = formatCurrency(order.refund_total, order.currency || "USD");
    const email = customerEmailFor(order);

    const subject = `Refund processed for order #${number}`;
    const bodyHtml = `<p>Hi,</p>
<p>A refund${refundAmount ? ` of ${refundAmount}` : ""} has been processed for order <strong>#${number}</strong>. Depending on your payment method, it may take a few business days to appear.</p>
<p>Questions? Just reply to this email.</p>`;
    const text = `Hi,

A refund${refundAmount ? ` of ${refundAmount}` : ""} has been processed for order #${number}. Depending on your payment method, it may take a few business days to appear.

Questions? Just reply to this email.

Vitality Certified Peptides`;

    if (email) {
      await sendEmail({ to: email, subject, html: wrapEmailHtml(bodyHtml), text });
    } else {
      await alertTeamNoEmail("Refunded order", number);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-order-refunded webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
