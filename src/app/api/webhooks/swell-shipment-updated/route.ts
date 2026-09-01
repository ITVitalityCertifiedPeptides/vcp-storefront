// Receives Swell's shipment-updated webhook (e.g. carrier marks it
// delivered) and sends the "Shipping update" email via Resend. Same
// root-cause/fix writeup and same caveats as swell-shipment-created - see
// that file's header comment and src/lib/swell-backend-notify.ts.
//
// Setup in Swell admin (Developer > Webhooks): event = "Shipment Updated"/
// "Shipping Update"-labeled option. URL =
// .../api/webhooks/swell-shipment-updated?token=<SWELL_WEBHOOK_SECRET>
// Once confirmed delivering, disable Swell's native "Shipping update"
// notification (Settings > Notifications).

import {
  checkAuth,
  fetchOrder,
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

  const orderId = body?.data?.order_id || body?.data?.id;
  if (!orderId) {
    return Response.json({ error: "Missing order id in payload" }, { status: 400 });
  }

  try {
    const order = await fetchOrder(orderId);
    const number = order.number ? String(order.number) : order.id;
    const email = customerEmailFor(order);
    const shipment = order.shipments?.[order.shipments.length - 1];
    const delivered = shipment?.delivered;
    const tracking = shipment?.tracking_code;
    const trackingUrl = shipment?.tracking_url;

    const subject = delivered
      ? `Your order #${number} was delivered`
      : `Update on your order #${number}`;
    const bodyHtml = `<p>Hi,</p>
<p>${delivered ? `Order <strong>#${number}</strong> has been delivered.` : `There's an update on order <strong>#${number}</strong>'s shipment.`}</p>
${tracking ? `<p>Tracking: ${trackingUrl ? `<a href="${trackingUrl}">${tracking}</a>` : tracking}</p>` : ""}
<p>Questions? Just reply to this email.</p>`;
    const text = `Hi,

${delivered ? `Order #${number} has been delivered.` : `There's an update on order #${number}'s shipment.`}
${tracking ? `Tracking: ${tracking}${trackingUrl ? ` - ${trackingUrl}` : ""}` : ""}

Questions? Just reply to this email.

Vitality Certified Peptides`;

    if (email) {
      await sendEmail({ to: email, subject, html: wrapEmailHtml(bodyHtml), text });
    } else {
      await alertTeamNoEmail("Shipment update for order", number);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-shipment-updated webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
