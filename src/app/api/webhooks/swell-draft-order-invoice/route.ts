// Receives Swell's draft-order webhook and emails the customer a link/notice
// that an invoice is ready. Same root-cause/fix writeup as
// swell-order-created - see the comment at the top of that file and
// src/lib/swell-backend-notify.ts.
//
// Draft orders are created by staff in Swell admin (for a manual/custom
// invoice, not a customer-driven checkout), so this is lower-traffic than
// the others - flagging that the exact trigger event name is less certain
// than the customer-checkout-driven ones. Try "Draft Order Created" or
// "Order Updated" (if drafts don't get their own event and this rides on a
// generic order.updated when `draft` flips) in the Developer > Webhooks
// event picker; whichever one it is, point it at:
// .../api/webhooks/swell-draft-order-invoice?token=<SWELL_WEBHOOK_SECRET>
//
// This route double-checks `order.draft` itself and no-ops otherwise, so if
// you end up wiring it to a broader event (like order.updated) it's safe -
// it'll just skip anything that isn't actually a draft.
//
// Once confirmed delivering, disable Swell's native "Draft order invoice"
// notification (Settings > Notifications).

import {
  checkAuth,
  fetchOrder,
  formatCurrency,
  customerEmailFor,
  wrapEmailHtml,
  itemsListHtml,
  summaryCardHtml,
  alertTeamNoEmail,
  type SwellWebhookBody,
} from "@/lib/swell-backend-notify";
import { paymentMethodCardsHtml } from "@/lib/order-confirmation-email";
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

    if (!order.draft) {
      return Response.json({ ok: true, skipped: "not a draft order" });
    }

    const number = order.number ? String(order.number) : order.id;
    const currency = order.currency || "USD";
    const total = formatCurrency(order.grand_total, currency);
    const email = customerEmailFor(order);

    const subject = `Your invoice is ready - order #${number}`;
    const bodyHtml = `<p>Hi,</p>
<p>Your invoice for order <strong>#${number}</strong> is ready.</p>
${summaryCardHtml([{ label: "Order", value: `#${number}` }, { label: "Total", value: total || "—", emphasize: true }])}
${itemsListHtml(order.items, currency)}
<h3 style="font-size:15px; margin: 24px 0 4px; border-bottom:1px solid #e6e1d6; padding-bottom:8px;">Complete your payment</h3>
<p style="font-size:14px; color:#6b6b6b; margin-top:8px;">Send the total above using <strong>ONE</strong> of the following:</p>
${paymentMethodCardsHtml()}
<p style="margin-top:20px;">Be sure to include your order number, <strong>#${number}</strong>, in the payment note or memo for faster processing. Reply to this email with any questions.</p>`;
    const text = `Hi,

Your invoice for order #${number}${total ? ` - Total: ${total}` : ""} is ready.

To complete your order, send the total using ONE of: Zelle (vcp-llc), Venmo (@vcpllc), Apple Cash ((626) 825-2165), or PayPal - Friends & Family only (marina@vitalitycertifiedpeptides.com). Include your order number in the payment note.

Reply to this email or contact us at customerservice@vitalitycertifiedpeptides.com with any questions.

Vitality Certified Peptides`;

    if (email) {
      await sendEmail({ to: email, subject, html: wrapEmailHtml(bodyHtml), text });
    } else {
      await alertTeamNoEmail("Draft order", number);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-draft-order-invoice webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
