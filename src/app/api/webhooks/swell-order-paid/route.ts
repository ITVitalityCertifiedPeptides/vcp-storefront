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
// Design (2026-09-02): rebuilt to use the same branded template shell as
// the Order confirmation email (logo header, order-details table) instead
// of the plain inline HTML this shipped with - see payment-received-email.ts.
// Also switched to the shared checkAuth()/fetchOrder() in
// swell-backend-notify.ts (fetchOrder already includes ?expand=account,
// the fix that made this route's emails actually reach customers -
// confirmed live 2026-09-01) instead of this route's own duplicated
// inline versions, so both stay in sync automatically going forward.
//
// Known limitation: no idempotency guard yet. If Swell retries a delivery
// (e.g. our endpoint times out after sending but before returning 200) the
// email could send twice for the same order. Low risk in practice - add an
// `payment_email_sent` custom field on the Order content model (Developer >
// Models, same pattern already used for Product's category/cas_number/
// ruo_disclaimer fields) and check/set it here if duplicates become a
// real problem.

import {
  checkAuth,
  fetchOrder,
  customerEmailFor,
  alertTeamNoEmail,
  type SwellWebhookBody,
} from "@/lib/swell-backend-notify";
import { buildPaymentReceivedEmailHtml, buildPaymentReceivedEmailText } from "@/lib/payment-received-email";
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
    const email = customerEmailFor(order);

    const subject = `Payment received - order #${number} is being processed`;
    const html = buildPaymentReceivedEmailHtml(order);
    const text = buildPaymentReceivedEmailText(order);

    if (email) {
      await sendEmail({ to: email, subject, html, text });
    } else {
      await alertTeamNoEmail("Paid order", number);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-order-paid webhook failed", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
