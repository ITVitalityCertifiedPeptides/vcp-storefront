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
// Design (2026-09-02): rebuilt to match the fuller, invoice-styled format
// Josh asked for - logo header, an order-details table, and a 2x2 grid of
// payment method cards (PayPal has a real QR code; see
// order-confirmation-email-assets.ts for why Zelle/Venmo don't have one yet)
// - instead of the plain text-first wrapEmailHtml() output this shipped
// with originally. See order-confirmation-email.ts for the template itself.
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
  customerEmailFor,
  alertTeamNoEmail,
  type SwellWebhookBody,
} from "@/lib/swell-backend-notify";
import { buildOrderConfirmationEmailHtml, buildOrderConfirmationEmailText } from "@/lib/order-confirmation-email";
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

    // Draft orders (staff-created, for manual invoicing) and orders already
    // paid at creation shouldn't get this email - the Draft order invoice
    // and Payment received emails cover those respectively.
    if (order.draft || order.paid) {
      return Response.json({ ok: true, skipped: order.draft ? "draft" : "already paid" });
    }

    const number = order.number ? String(order.number) : order.id;
    const email = customerEmailFor(order);

    const subject = `Order received - #${number}`;
    const html = buildOrderConfirmationEmailHtml(order);
    const text = buildOrderConfirmationEmailText(order);

    if (email) {
      await sendEmail({ to: email, subject, html, text });
    } else {
      await alertTeamNoEmail("Order", number);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-order-created webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
