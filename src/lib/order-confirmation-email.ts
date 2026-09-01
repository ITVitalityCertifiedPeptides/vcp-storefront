// Redesigned "Order confirmation" email - the fuller, invoice-styled format
// Josh asked for (2026-09-01: "the qr codes and the format we had made for
// order confirmatin") to replace the plain text-first wrapEmailHtml()
// output that was shipping via swell-order-created/route.ts.
//
// This borrows the visual structure of the old manually-sent
// invoice_email.html (logo header, order table, 2x2 payment grid with
// clickable QR codes) but is meant to be sent automatically by that route,
// so it's built as a plain string template here rather than a static file.
//
// All four payment methods have real, scannable QR codes as of 2026-09-02 -
// see order-confirmation-email-assets.ts for how each was sourced and
// round-trip verified (Zelle and Venmo were decoded from fresh screenshots
// Josh sent that day; PayPal was regenerated from the URL already live in
// this route's payment copy).
//
// Images are hosted (public/email-assets/*.png), NOT inlined as base64
// data: URIs (2026-09-02 fix). Gmail - and most other webmail clients -
// strip or refuse to render `<img src="data:...">` in received HTML email
// for security/spam reasons; only a handful of very permissive clients
// (some desktop apps) show them. Josh confirmed the base64 version arrived
// with no images at all. `order-confirmation-email-assets.ts` still holds
// the base64 source of truth (useful for regenerating the PNG files if the
// QR/logo ever needs to change) but nothing here imports it anymore.

import "server-only";
import type { SwellOrder } from "./swell-backend-notify";
import { formatCurrency } from "./swell-backend-notify";
import { siteConfig } from "./site";

const LOGO_EMBLEM_URL = `${siteConfig.url}/email-assets/logo-emblem.png`;
const PAYPAL_QR_URL = `${siteConfig.url}/email-assets/qr-paypal.png`;
const ZELLE_QR_URL = `${siteConfig.url}/email-assets/qr-zelle.png`;
const VENMO_QR_URL = `${siteConfig.url}/email-assets/qr-venmo.png`;

const GOLD = "#a67c27";
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

function paymentCard(opts: {
  label: string;
  detail: string;
  qrUrl?: string;
  linkUrl?: string;
  linkLabel?: string;
}): string {
  const { label, detail, qrUrl, linkUrl, linkLabel } = opts;
  const qrBlock = qrUrl
    ? `<img src="${qrUrl}" width="120" height="120" alt="${label} QR code" style="display:block; margin:0 auto 10px; border-radius:6px;" />`
    : "";
  const linkBlock = linkUrl
    ? `<a href="${linkUrl}" style="display:inline-block; margin-top:8px; font-size:12px; color:${GOLD}; text-decoration:underline;">${linkLabel ?? "Tap to pay"}</a>`
    : "";
  return `<td width="50%" valign="top" style="padding:8px;">
    <div style="background:${CARD_BG}; border:1px solid ${BORDER}; border-radius:10px; padding:16px; text-align:center;">
      <div style="font-size:13px; font-weight:bold; letter-spacing:0.3px; color:${INK}; margin-bottom:8px;">${label}</div>
      ${qrBlock}
      <div style="font-size:13px; color:${INK}; line-height:1.4;">${detail}</div>
      ${linkBlock}
    </div>
  </td>`;
}

export function buildOrderConfirmationEmailHtml(order: SwellOrder): string {
  const number = order.number ? String(order.number) : order.id;
  const currency = order.currency || "USD";
  const total = formatCurrency(order.grand_total, currency);
  const itemsHtml = itemsTableHtml(order.items, currency);

  const paypalUrl =
    "https://www.paypal.com/qrcodes/managed/07ea7259-48c4-4c02-aad0-1aadb5b7f912?utm_source=consapp_download";
  const zelleUrl =
    "https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiVklUQUxJVFkgQ0VSVElGSUVEIFBFUFRJREVTIExMQyBBY2NvdW50cyIsInRva2VuIjoidmNwLWxsYyJ9";
  const venmoUrl =
    "https://www.paypal.com/qrcodes/venmocs/f953a8fe-edd4-4225-9c5a-9046eb30cd4f?created=1788015862.237005";

  const cards = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:8px 0 4px;">
    <tr>
      ${paymentCard({ label: "ZELLE", detail: "vcp-llc<br/><span style=\"color:" + MUTED + ";\">Vitality Certified Peptides LLC Accounts</span>", qrUrl: ZELLE_QR_URL, linkUrl: zelleUrl, linkLabel: "Scan the QR or tap to pay" })}
      ${paymentCard({ label: "VENMO", detail: "@vcpllc<br/><span style=\"color:" + MUTED + ";\">Vitality Certified Peptides LLC</span>", qrUrl: VENMO_QR_URL, linkUrl: venmoUrl, linkLabel: "Scan the QR or tap to pay" })}
    </tr>
    <tr>
      ${paymentCard({ label: "APPLE CASH", detail: "(626) 825-2165", linkUrl: "sms:+16268252165", linkLabel: "Open Messages to pay" })}
      ${paymentCard({ label: "PAYPAL — FRIENDS &amp; FAMILY ONLY", detail: "Marina E Coss", qrUrl: PAYPAL_QR_URL, linkUrl: paypalUrl, linkLabel: "Scan the QR or tap to pay" })}
    </tr>
  </table>`;

  return `<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: ${INK}; background:#ffffff;">
  <div style="padding: 28px 0 18px; text-align:center; border-bottom: 2px solid ${GOLD};">
    <img src="${LOGO_EMBLEM_URL}" width="48" height="48" alt="Vitality Certified Peptides" style="display:block; margin:0 auto 10px;" />
    <span style="font-size: 19px; font-weight: bold; letter-spacing: 0.5px;">VITALITY <span style="font-weight: normal;">CERTIFIED PEPTIDES</span></span>
  </div>

  <div style="padding: 24px 8px; font-size: 15px; line-height: 1.6;">
    <p style="margin-top:0;">Thanks for your order with Vitality Certified Peptides.</p>

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

    <h3 style="font-size:15px; margin: 24px 0 4px; border-bottom:1px solid ${BORDER}; padding-bottom:8px;">Complete your payment</h3>
    <p style="font-size:14px; color:${MUTED}; margin-top:8px;">Send the total above using <strong>ONE</strong> of the following:</p>

    ${cards}

    <p style="margin-top:20px;">Be sure to include your order number, <strong>#${number}</strong>, in the payment note or memo for faster processing. Once sent, reply to this email and let us know which method you used &mdash; our team confirms payments and approves orders Monday through Friday during business hours. Once approved, it's processed the same day, and you'll receive tracking along with the Certificate of Analysis for your exact lot once it ships.</p>

    <p style="font-size:12px; color:${MUTED}; margin-top:20px;">Reminder: all products are for laboratory research use only and are not for human or veterinary use.</p>
  </div>

  <div style="padding: 16px 8px; border-top: 1px solid ${BORDER}; font-size: 12px; color: ${MUTED}; text-align:center;">
    Vitality Certified Peptides &middot; www.vitalitycertifiedpeptides.com
  </div>
</div>`;
}

export function buildOrderConfirmationEmailText(order: SwellOrder): string {
  const number = order.number ? String(order.number) : order.id;
  const total = formatCurrency(order.grand_total, order.currency || "USD");
  const items =
    order.items && order.items.length > 0
      ? order.items
          .map((i) => `  ${i.product_name ?? "Item"} x${i.quantity ?? 1} - ${formatCurrency(i.price, order.currency || "USD")}`)
          .join("\n")
      : "";

  return `Thanks for your order with Vitality Certified Peptides.

Order #${number}${total ? ` - Total: ${total}` : ""}
${items ? `\n${items}\n` : ""}
To complete your order, send the total above using ONE of the following:
Zelle: vcp-llc (Vitality Certified Peptides LLC Accounts)
Venmo: @vcpllc (Vitality Certified Peptides LLC)
Apple Cash: (626) 825-2165
PayPal (Friends & Family only): Marina E Coss - https://www.paypal.com/qrcodes/managed/07ea7259-48c4-4c02-aad0-1aadb5b7f912?utm_source=consapp_download

Be sure to include your order number, #${number}, in the payment note or memo for faster processing. Once sent, reply to this email and let us know which method you used - our team confirms payments and approves orders Monday through Friday during business hours. Once approved, it's processed the same day, and you'll receive tracking along with the Certificate of Analysis for your exact lot once it ships.

Reminder: all products are for laboratory research use only and are not for human or veterinary use.

Vitality Certified Peptides
www.vitalitycertifiedpeptides.com`;
}
