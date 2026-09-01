// Receives Swell's `order.created` (or "Order Placed"/"Order Created" -
// whatever the event is labeled in the Developer > Webhooks event picker)
// webhook and sends the Order confirmation email via Resend.
//
// THIS IS THE URGENT ONE. As of 2026-09-01, Swell's native "Order
// confirmation" notification is not reaching customers at all (verified with
// a real test order, #100005 - see claude/Invoice Email Template.md and the
// long comment in src/lib/swell-backend-notify.ts for the full root-cause
// writeup: this domain's own SPF/DMARC rejects Swell's unauthenticated
// native sends). This route replaces it, on the same Resend channel already
// proven to work for the "Payment received" email.
//
// Content matches what the Swell "Preparation note" field was supposed to
// say (Invoice Email Template.md, fixed 2026-08-30) - order details plus all
// four payment methods, since checkout is invoice-based and nothing is
// charged online.
//
// Setup needed in Swell admin (Developer > Webhooks): add a webhook, event =
// whatever the picker calls order creation/placement (try "Order Created" or
// "Order Placed" first), URL =
// https://www.vitalitycertifiedpeptides.com/api/webhooks/swell-order-created?token=<SWELL_WEBHOOK_SECRET>
// (same secret already set in Vercel for the swell-order-paid webhook - do
// not reuse the payment-received-email webhook's own URL, this needs its own
// entry pointed at this new route).
//
// IMPORTANT: once this is confirmed actually delivering (send one more real
// test order after setup and check the inbox), go disable Swell's native
// "Order confirmation" notification (Settings > Notifications > Order
// confirmation > toggle off) so customers never get silently dropped mail
// again and nobody's confused by Swell's dashboard claiming it "sent".

import {
  checkAuth,
  fetchOrder,
  formatCurrency,
  customerEmailFor,
  wrapEmailHtml,
  itemsListHtml,
  alertTeamNoEmail,
  type SwellWebhookBody,
} from "@/lib/swell-backend-notify";
import { sendEmail } from "@/lib/resend";

// Keep this in sync with Invoice Email Template.md's "Preparation note"
// content if the payment handles/copy ever change.
const PAYMENT_OPTIONS_HTML = `<p>To complete your order, send the total above using <strong>ONE</strong> of the following:</p>
<p style="margin:4px 0;">Zelle: vcp-llc (Vitality Certified Peptides LLC Accounts)<br/>
Venmo: @vcpllc (Vitality Certified Peptides LLC)<br/>
Apple Cash: (626) 825-2165<br/>
PayPal (Friends &amp; Family only): Marina E Coss - <a href="https://www.paypal.com/qrcodes/managed/07ea7259-48c4-4c02-aad0-1aadb5b7f912">pay via PayPal</a></p>
<p>Be sure to include your order number in the payment note or memo for faster processing. Once sent, reply to this email and let us know which method you used - our team confirms payments and approves orders Monday through Friday during business hours. Once approved, it's processed the same day, and you'll receive tracking along with the Certificate of Analysis for your exact lot once it ships.</p>`;

const PAYMENT_OPTIONS_TEXT = `To complete your order, send the total above using ONE of the following:
Zelle: vcp-llc (Vitality Certified Peptides LLC Accounts)
Venmo: @vcpllc (Vitality Certified Peptides LLC)
Apple Cash: (626) 825-2165
PayPal (Friends & Family only): Marina E Coss - https://www.paypal.com/qrcodes/managed/07ea7259-48c4-4c02-aad0-1aadb5b7f912

Be sure to include your order number in the payment note or memo for faster processing. Once sent, reply to this email and let us know which method you used - our team confirms payments and approves orders Monday through Friday during business hours. Once approved, it's processed the same day, and you'll receive tracking along with the Certificate of Analysis for your exact lot once it ships.`;

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

    // Draft orders (staff-created, for manual invoicing) and orders already
    // paid at creation shouldn't get this email - the Draft order invoice
    // and Payment received emails cover those respectively.
    if (order.draft || order.paid) {
      return Response.json({ ok: true, skipped: order.draft ? "draft" : "already paid" });
    }

    const number = order.number ? String(order.number) : order.id;
    const total = formatCurrency(order.grand_total, order.currency || "USD");
    const email = customerEmailFor(order);

    const subject = `Order received - #${number}`;
    const bodyHtml = `<p>Thanks for your order with Vitality Certified Peptides.</p>
<p><strong>Order #${number}</strong>${total ? ` &mdash; Total: ${total}` : ""}</p>
${itemsListHtml(order.items)}
${PAYMENT_OPTIONS_HTML}
<p style="font-size:12px; color:#777;">Reminder: all products are for laboratory research use only and are not for human or veterinary use.</p>`;
    const text = `Thanks for your order with Vitality Certified Peptides.

Order #${number}${total ? ` - Total: ${total}` : ""}

${PAYMENT_OPTIONS_TEXT}

Reminder: all products are for laboratory research use only and are not for human or veterinary use.`;

    if (email) {
      await sendEmail({ to: email, subject, html: wrapEmailHtml(bodyHtml), text });
    } else {
      await alertTeamNoEmail("Order", number);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-order-created webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
