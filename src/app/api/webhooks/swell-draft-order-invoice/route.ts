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
  ackWebhookFailure,
  checkAuth,
  fetchOrder,
  customerEmailFor,
  alertTeamNoEmail,
  type SwellWebhookBody,
} from "@/lib/swell-backend-notify";
import { buildInvoiceEmail } from "@/lib/invoice-email";
import { sendEmail } from "@/lib/resend";
import { notifyAdmins } from "@/lib/admin-order-notify";

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SwellWebhookBody;
  try {
    body = (await request.json()) as SwellWebhookBody;
  } catch {
    return Response.json({ ok: true, skipped: "invalid json" });
  }

  const orderId = body?.data?.id;
  if (!orderId) {
    return Response.json({ ok: true, skipped: "missing id in payload" });
  }

  try {
    const order = await fetchOrder(orderId);

    if (!order.draft) {
      return Response.json({ ok: true, skipped: "not a draft order" });
    }

    const number = order.number ? String(order.number) : order.id;
    const email = customerEmailFor(order);
    const { subject, html, text } = buildInvoiceEmail(order);

    if (email) {
      await sendEmail({ to: email, subject, html, text });
    } else {
      await alertTeamNoEmail("Draft order", number);
    }

    // Internal copy for the team (never throws).
    await notifyAdmins("draft_invoice_sent", order, { customerEmailed: Boolean(email), customerEmail: email });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("swell-draft-order-invoice webhook failed", err);
    return ackWebhookFailure("swell-draft-order-invoice", err, body?.data?.id);
  }
}
