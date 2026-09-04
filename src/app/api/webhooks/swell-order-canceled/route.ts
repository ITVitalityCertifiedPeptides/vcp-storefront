// Receives Swell's order-canceled webhook and sends the "Order canceled"
// email via Resend. Same root-cause/fix writeup as swell-order-created -
// see the comment at the top of that file and src/lib/swell-backend-notify.ts.
//
// Setup in Swell admin (Developer > Webhooks): event = whatever the picker
// calls it (try "Order Canceled"), URL =
// .../api/webhooks/swell-order-canceled?token=<SWELL_WEBHOOK_SECRET>
// Once confirmed delivering, disable Swell's native "Order canceled"
// notification (Settings > Notifications).

import {
  checkAuth,
  fetchOrder,
  formatCurrency,
  customerEmailFor,
  wrapEmailHtml,
  alertTeamNoEmail,
  badgeHtml,
  summaryCardHtml,
  itemsListHtml,
  BRAND,
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
    const currency = order.currency || "USD";
    const total = formatCurrency(order.grand_total, currency);
    const email = customerEmailFor(order);

    const subject = `Your order #${number} has been canceled`;
    const bodyHtml = `${badgeHtml("ORDER CANCELED", BRAND.red)}
<p>Hi,</p>
<p>Your order <strong>#${number}</strong> has been canceled. No payment is required.</p>
${summaryCardHtml([{ label: "Order", value: `#${number}` }, { label: "Total", value: total || "—" }])}
${itemsListHtml(order.items, currency)}
<p>If this wasn't expected, or you'd still like these items, just reply to this email or place a new order any time.</p>`;
    const text = `Hi,

Your order #${number}${total ? ` (${total})` : ""} has been canceled. No payment is required.

If this wasn't expected, or you'd still like these items, just reply to this email or place a new order any time.

Vitality Certified Peptides`;

    if (email) {
      await sendEmail({ to: email, subject, html: wrapEmailHtml(bodyHtml), text });
    } else {
      await alertTeamNoEmail("Canceled order", number);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-order-canceled webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
