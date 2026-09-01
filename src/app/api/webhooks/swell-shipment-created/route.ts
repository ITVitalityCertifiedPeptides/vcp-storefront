// Receives Swell's shipment-created webhook and sends the "Shipping
// confirmation" email (tracking number/link) via Resend. Same root-
// cause/fix writeup as swell-order-created - see the comment at the top of
// that file and src/lib/swell-backend-notify.ts.
//
// LOWER CONFIDENCE THAN THE ORDER-BASED ROUTES: Swell's Backend API does not
// clearly document a standalone top-level Shipments resource - shipment/
// tracking data more likely lives nested on the Order (`order.shipments`,
// already typed in SwellOrder). This route ASSUMES `data.id` on the webhook
// payload is the ORDER id (not a separate shipment id) and reads the most
// recent entry from `order.shipments`. If a real test delivery shows
// `data.id` is actually a distinct shipment id with its own model, this
// needs a dedicated fetch instead of fetchOrder() - check the "model" field
// on the webhook payload when you register and test this one.
//
// Setup in Swell admin (Developer > Webhooks): event = "Shipment Created"/
// "Shipping Confirmation"-labeled option. URL =
// .../api/webhooks/swell-shipment-created?token=<SWELL_WEBHOOK_SECRET>
// Once confirmed delivering, disable Swell's native "Shipping confirmation"
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
    const tracking = shipment?.tracking_code;
    const trackingUrl = shipment?.tracking_url;
    const carrier = shipment?.carrier;

    const subject = `Your order #${number} has shipped`;
    const bodyHtml = `<p>Hi,</p>
<p>Order <strong>#${number}</strong> is on its way!</p>
${tracking ? `<p>Tracking${carrier ? ` (${carrier})` : ""}: ${trackingUrl ? `<a href="${trackingUrl}">${tracking}</a>` : tracking}</p>` : ""}
<p>A digital copy of the Certificate of Analysis for your exact lot will follow separately.</p>`;
    const text = `Hi,

Order #${number} is on its way!
${tracking ? `Tracking${carrier ? ` (${carrier})` : ""}: ${tracking}${trackingUrl ? ` - ${trackingUrl}` : ""}` : ""}

A digital copy of the Certificate of Analysis for your exact lot will follow separately.

Vitality Certified Peptides`;

    if (email) {
      await sendEmail({ to: email, subject, html: wrapEmailHtml(bodyHtml), text });
    } else {
      await alertTeamNoEmail("Shipped order", number);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-shipment-created webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
