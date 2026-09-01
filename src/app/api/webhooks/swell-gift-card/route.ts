// Receives Swell's gift-card webhook and emails the recipient their code.
// Same root-cause/fix writeup as swell-order-created - see the comment at
// the top of that file and src/lib/swell-backend-notify.ts.
//
// LOWER CONFIDENCE THAN THE ORDER-BASED ROUTES: gift cards may currently
// only exist on this store as line items purchased through a normal order
// (in which case `data.id` on the webhook is an order id, and this route's
// fetchOrder call below is correct as-is), OR Swell's admin may have a
// dedicated gift-card resource/event with its own id space - if so, this
// needs a `fetchGiftCard(id)` helper hitting whatever endpoint Swell's
// Console (Developer > Console, GET, try `/giftcards` or `/:giftcards`)
// shows for that collection, not fetchOrder. Check which one when you
// register this webhook and see what "model" comes through on a real test
// delivery, and adjust below if it's not "orders".
//
// Setup in Swell admin (Developer > Webhooks): event = "Gift Card"-labeled
// option in the picker. URL =
// .../api/webhooks/swell-gift-card?token=<SWELL_WEBHOOK_SECRET>
// Once confirmed delivering, disable Swell's native "Gift card" notification
// (Settings > Notifications).

import {
  checkAuth,
  fetchOrder,
  customerEmailFor,
  wrapEmailHtml,
  alertTeamNoEmail,
  formatCurrency,
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

  const id = body?.data?.id;
  if (!id) {
    return Response.json({ error: "Missing id in payload" }, { status: 400 });
  }

  try {
    // See file header - assumes model is "orders" (gift card purchased as a
    // line item). If Swell's real payload model is something else, this
    // fetch needs to change to match.
    const order = await fetchOrder(id);
    const email = customerEmailFor(order);
    const giftcard = order.giftcards?.[0];
    const amount = formatCurrency(giftcard?.amount, order.currency || "USD");
    const code = giftcard?.code;

    const subject = "Your Vitality Certified Peptides gift card";
    const bodyHtml = `<p>Hi,</p>
<p>Here's your gift card${amount ? ` (${amount})` : ""}${code ? `: <strong>${code}</strong>` : ""}.</p>
<p>Enter it at checkout on vitalitycertifiedpeptides.com to redeem.</p>`;
    const text = `Hi,

Here's your gift card${amount ? ` (${amount})` : ""}${code ? `: ${code}` : ""}.

Enter it at checkout on vitalitycertifiedpeptides.com to redeem.

Vitality Certified Peptides`;

    if (email) {
      await sendEmail({ to: email, subject, html: wrapEmailHtml(bodyHtml), text });
    } else {
      await alertTeamNoEmail("Gift card order", order.number ?? id);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-gift-card webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
