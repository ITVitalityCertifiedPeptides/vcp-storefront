// Receives Swell's cart-abandoned webhook and emails a recovery reminder via
// Resend. Same root-cause/fix writeup as swell-order-created - see the
// comment at the top of that file and src/lib/swell-backend-notify.ts.
//
// NOTE: per claude/Site Build Priorities and Decisions.md, Abandoned cart
// recovery was deliberately left OFF as of the 2026-08-18 settings audit
// (not part of the invoice-checkout flow that was live then). This route is
// built for parity with the other 8 native notification types per Josh's
// 2026-09-01 request to cover all of them, but it will never fire until (a)
// abandoned-cart tracking is actually turned on in Swell and (b) the webhook
// below is registered. Confirm with Josh whether abandoned-cart recovery
// should actually go live before registering this one - no rush on it the
// way the Order confirmation fix is.
//
// LOWER CONFIDENCE THAN THE ORDER-BASED ROUTES: uses fetchCart(), a best-
// effort guess at Swell's Backend API cart-fetch path (see the comment on
// fetchCart in swell-backend-notify.ts) - verify against a real test
// delivery before trusting this one.
//
// Setup in Swell admin (Developer > Webhooks): event = "Cart Abandoned"-
// labeled option. URL =
// .../api/webhooks/swell-cart-abandoned?token=<SWELL_WEBHOOK_SECRET>

import {
  checkAuth,
  fetchCart,
  formatCurrency,
  customerEmailFor,
  wrapEmailHtml,
  itemsListHtml,
  ctaButtonHtml,
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

  const cartId = body?.data?.id;
  if (!cartId) {
    return Response.json({ error: "Missing cart id in payload" }, { status: 400 });
  }

  try {
    const cart = await fetchCart(cartId);
    const email = customerEmailFor(cart);
    // No email on file for an abandoned guest cart just means nobody to
    // notify - unlike an order, there's no team-alert fallback here, since
    // there's no transaction to follow up on.
    if (!email) {
      return Response.json({ ok: true, skipped: "no email on cart" });
    }

    const currency = cart.currency || "USD";
    const total = formatCurrency(cart.grand_total, currency);
    const checkoutUrl = cart.checkout_url || "https://www.vitalitycertifiedpeptides.com/cart";
    const subject = "You left something in your cart";
    const bodyHtml = `<p>Hi,</p>
<p>You left an order in progress${total ? ` (${total})` : ""}. It's still saved and ready whenever you are.</p>
${itemsListHtml(cart.items, currency)}
${ctaButtonHtml("Finish your order", checkoutUrl)}`;
    const text = `Hi,

You left an order in progress${total ? ` (${total})` : ""}. It's still saved and ready whenever you are.

${cart.checkout_url ?? "https://www.vitalitycertifiedpeptides.com/cart"}

Vitality Certified Peptides`;

    await sendEmail({ to: email, subject, html: wrapEmailHtml(bodyHtml), text });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-cart-abandoned webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
