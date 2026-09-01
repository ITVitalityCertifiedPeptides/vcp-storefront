// "Payment received / processing" email - redesigned 2026-09-02 to match the
// branded invoice-styled look built for the Order confirmation email
// (order-confirmation-email.ts), instead of the plain inline <p> HTML this
// email shipped with originally (swell-order-paid/route.ts, live since
// 2026-08-21).
//
// Sent by swell-order-paid/route.ts when a Swell `order.paid` webhook fires
// - i.e. the moment staff click "Charge order" in Swell admin after
// confirming a customer's Zelle/Venmo/Apple Cash/PayPal payment against the
// order. This is the email that tells the customer "we got your money and
// we're processing your order" - no payment instructions needed here, that
// was the Order confirmation email's job.

import "server-only";
import type { SwellOrder } from "./swell-backend-notify";
import { formatCurrency } from "./swell-backend-notify";
import { LOGO_EMBLEM_PNG_BASE64 } from "./order-confirmation-email-assets";

const GOLD = "#a67c27";
const GREEN = "#2f7a3d";
const INK = "#1a1a1a";
const MUTED = "#6b6b6b";
const BORDER = "#e6e1d6";
const CARD_BG = "#faf8f3";

function itemsTableHtml(items: SwellOrder["items"], currency: string): string {
  if (!items || items.length === 0) return "";
  const rows = items
    .map((i) => {
      const price = formatCurrency(i.price, currency);
      const qty = i.quantity ?? 1;
      const lineTotal = formatCurrency((i.price ?? 0) * qty, currency);
      return `<tr>
        <td style="padding:10px 8px; border-bottom:1px solid ${BORDER}; font-size:14px; color:${INK};">${i.product_name ?? "Item"}</td>
        <td style="padding:10px 8px; border-bottom:1px solid ${BORDER}; font-size:14px; color:${MUTED}; text-align:center;">x${qty}</td>
        <td style="padding:10px 8px; border-bottom:1px solid ${BORDER}; font-size:14px; color:${MUTED}; text-align:right;">${price}</td>
        <td style="padding:10px 8px; border-bottom:1px solid ${BORDER}; font-size:14px; color:${INK}; text-align:right; font-weight:bold;">${lineTotal}</td>
      </tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:16px 0;">
    <thead>
      <tr>
        <th align="left" style="padding:0 8px 8px; font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:${MUTED}; border-bottom:2px solid ${GOLD};">Item</th>
        <th align="center" style="padding:0 8px 8px; font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:${MUTED}; border-bottom:2px solid ${GOLD};">Qty</th>
        <th align="right" style="padding:0 8px 8px; font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:${MUTED}; border-bottom:2px solid ${GOLD};">Price</th>
        <th align="right" style="padding:0 8px 8px; font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:${MUTED}; border-bottom:2px solid ${GOLD};">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

export function buildPaymentReceivedEmailHtml(order: SwellOrder): string {
  const number = order.number ? String(order.number) : order.id;
  const currency = order.currency || "USD";
  const total = formatCurrency(order.grand_total, currency);
  const itemsHtml = itemsTableHtml(order.items, currency);

  return `<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: ${INK}; background:#ffffff;">
  <div style="padding: 28px 0 18px; text-align:center; border-bottom: 2px solid ${GOLD};">
    <img src="data:image/png;base64,${LOGO_EMBLEM_PNG_BASE64}" width="48" height="48" alt="Vitality Certified Peptides" style="display:block; margin:0 auto 10px;" />
    <span style="font-size: 19px; font-weight: bold; letter-spacing: 0.5px;">VITALITY <span style="font-weight: normal;">CERTIFIED PEPTIDES</span></span>
  </div>

  <div style="padding: 24px 8px; font-size: 15px; line-height: 1.6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin: 0 0 16px;">
      <tr>
        <td style="padding:6px 10px; background:${GREEN}; border-radius:20px; text-align:center;">
          <span style="color:#ffffff; font-size:13px; font-weight:bold; letter-spacing:0.5px;">&#10003; PAYMENT RECEIVED</span>
        </td>
      </tr>
    </table>

    <p style="margin-top:0;">Hi,</p>
    <p>We've received your payment and your order is now being processed.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; background:${CARD_BG}; border:1px solid ${BORDER}; border-radius:10px; margin: 16px 0;">
      <tr>
        <td style="padding:14px 18px;">
          <span style="font-size:12px; letter-spacing:0.5px; text-transform:uppercase; color:${MUTED};">Order</span><br/>
          <span style="font-size:18px; font-weight:bold;">#${number}</span>
        </td>
        <td style="padding:14px 18px; text-align:right;">
          <span style="font-size:12px; letter-spacing:0.5px; text-transform:uppercase; color:${MUTED};">Total</span><br/>
          <span style="font-size:18px; font-weight:bold; color:${GOLD};">${total}</span>
        </td>
      </tr>
    </table>

    ${itemsHtml}

    <p style="margin-top:20px;">Orders ship within 1 business day of approval. You'll receive a separate email with tracking and the Certificate of Analysis for your exact lot once it ships.</p>

    <p style="font-size:12px; color:${MUTED}; margin-top:20px;">Reminder: all products are for laboratory research use only and are not for human or veterinary use.</p>

    <p style="margin-top:20px;">Questions? Just reply to this email.</p>
  </div>

  <div style="padding: 16px 8px; border-top: 1px solid ${BORDER}; font-size: 12px; color: ${MUTED}; text-align:center;">
    Vitality Certified Peptides &middot; www.vitalitycertifiedpeptides.com
  </div>
</div>`;
}

export function buildPaymentReceivedEmailText(order: SwellOrder): string {
  const number = order.number ? String(order.number) : order.id;
  const total = formatCurrency(order.grand_total, order.currency || "USD");
  const items =
    order.items && order.items.length > 0
      ? order.items
          .map((i) => `  ${i.product_name ?? "Item"} x${i.quantity ?? 1} - ${formatCurrency(i.price, order.currency || "USD")}`)
          .join("\n")
      : "";

  return `PAYMENT RECEIVED

Hi,

We've received your payment and your order is now being processed.

Order #${number}${total ? ` - Total: ${total}` : ""}
${items ? `\n${items}\n` : ""}
Orders ship within 1 business day of approval. You'll receive a separate email with tracking and the Certificate of Analysis for your exact lot once it ships.

Reminder: all products are for laboratory research use only and are not for human or veterinary use.

Questions? Just reply to this email.

Vitality Certified Peptides
www.vitalitycertifiedpeptides.com`;
}
