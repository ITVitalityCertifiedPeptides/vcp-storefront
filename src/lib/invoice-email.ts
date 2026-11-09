// The invoice email: items, total, and every way to pay (QR codes + links).
// Shared by the draft-order webhook and the staff portal "Send invoice"
// page, so the two can never drift apart. Swell's own "Send invoice" button
// is not used anymore: it sends from Swell's servers and fails this
// domain's DMARC, so Microsoft shows customers an impersonation warning.

import "server-only";
import {
  formatCurrency,
  itemsListHtml,
  summaryCardHtml,
  wrapEmailHtml,
  type SwellOrder,
} from "@/lib/swell-backend-notify";
import { paymentMethodCardsHtml } from "@/lib/order-confirmation-email";

export function buildInvoiceEmail(order: SwellOrder): { subject: string; html: string; text: string } {
  const number = order.number ? String(order.number) : order.id;
  const currency = order.currency || "USD";
  const total = formatCurrency(order.grand_total, currency);

  const subject = `Your invoice is ready - order #${number}`;
  const bodyHtml = `<p>Hi,</p>
<p>Your invoice for order <strong>#${number}</strong> is ready.</p>
${summaryCardHtml([{ label: "Order", value: `#${number}` }, { label: "Total", value: total || "—", emphasize: true }])}
${itemsListHtml(order.items, currency)}
<h3 style="font-size:15px; margin: 24px 0 4px; border-bottom:1px solid #e6e1d6; padding-bottom:8px;">Complete your payment</h3>
<p style="font-size:14px; color:#6b6b6b; margin-top:8px;">Send the total above using <strong>ONE</strong> of the following:</p>
${paymentMethodCardsHtml()}
<p style="margin-top:20px;">Be sure to include your order number, <strong>#${number}</strong>, in the payment note or memo for faster processing. Reply to this email with any questions.</p>`;
  const text = `Hi,

Your invoice for order #${number}${total ? ` - Total: ${total}` : ""} is ready.

To complete your order, send the total using ONE of: Zelle (vcp-llc), Venmo (@Jeffery-Coss), Apple Cash ((626) 825-2165), or PayPal - Friends & Family only (marina@vitalitycertifiedpeptides.com). Include your order number in the payment note.

Reply to this email or contact us at customerservice@vitalitycertifiedpeptides.com with any questions.

Vitality Certified Peptides`;

  return { subject, html: wrapEmailHtml(bodyHtml), text };
}
