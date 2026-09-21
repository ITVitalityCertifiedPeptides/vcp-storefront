// Payment instructions for ONE method (2026-09-21). The customer picks how
// they'll pay at checkout (metadata.payment_method, ids in
// lib/payment-methods.ts); the order and reminder emails show just that
// method, with the exact amount and a pre-filled pay link where the service
// supports one (Venmo). Orders without a stored method (placed before this
// change, or created by staff scripts) fall back to the full four-card grid.

import "server-only";
import type { SwellOrder } from "./swell-backend-notify";
import { formatCurrency } from "./swell-backend-notify";
import { siteConfig } from "./site";
import { isPaymentMethodId, type PaymentMethodId, WIRE_MIN_TOTAL } from "./payment-methods";
import { WIRE, wireCardHtml, wireText } from "./wire-instructions";
import { paymentMethodCardsHtml } from "./order-confirmation-email";

const GOLD = "#a67c27";
const INK = "#1a1a1a";
const MUTED = "#6b6b6b";
const BORDER = "#e6e1d6";
const CARD_BG = "#faf8f3";

const QR = {
  zelle: `${siteConfig.url}/email-assets/qr-zelle.png`,
  venmo: `${siteConfig.url}/email-assets/qr-venmo.png`,
  paypal: `${siteConfig.url}/email-assets/qr-paypal.png`,
};

export const VENMO_HANDLE = "Jeffery-Coss";
const ZELLE_URL =
  "https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiVklUQUxJVFkgQ0VSVElGSUVEIFBFUFRJREVTIExMQyBBY2NvdW50cyIsInRva2VuIjoidmNwLWxsYyJ9";
const PAYPAL_URL =
  "https://www.paypal.com/qrcodes/managed/07ea7259-48c4-4c02-aad0-1aadb5b7f912?utm_source=consapp_download";
const APPLE_CASH_NUMBER = "(626) 825-2165";
const APPLE_CASH_SMS = "sms:+16268252165";

export function chosenPaymentMethod(order: SwellOrder): PaymentMethodId | null {
  const v = order.metadata?.payment_method;
  return isPaymentMethodId(v) ? v : null;
}

export function orderNumberOf(order: SwellOrder): string {
  return order.number ? String(order.number) : order.id;
}

// Venmo opens with recipient, amount and note filled in. The https form
// works everywhere (web on desktop, hands off to the app on phones).
export function venmoPayUrl(amount: number, orderNumber: string): string {
  const q = new URLSearchParams({
    txn: "pay",
    audience: "private",
    recipients: VENMO_HANDLE,
    amount: amount.toFixed(2),
    note: `VCP order #${orderNumber}`,
  });
  return `https://venmo.com/?${q.toString()}`;
}

// Does this order's email need the wiring-instructions PDF attached?
export function wantsWireAttachment(order: SwellOrder): boolean {
  const m = chosenPaymentMethod(order);
  if (m === "wire") return true;
  if (m) return false;
  return (order.grand_total ?? 0) >= WIRE_MIN_TOTAL;
}

function card(inner: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:8px 0 4px;">
    <tr><td style="padding:8px;">
      <div style="background:${CARD_BG}; border:1px solid ${BORDER}; border-radius:10px; padding:20px 18px; text-align:center;">${inner}</div>
    </td></tr>
  </table>`;
}

function button(label: string, url: string): string {
  return `<a href="${url}" style="display:inline-block; margin:12px 0 4px; padding:12px 26px; background:${GOLD}; color:#ffffff; font-size:14px; font-weight:bold; letter-spacing:0.3px; border-radius:999px; text-decoration:none;">${label}</a>`;
}

function amountLine(amount: string): string {
  return `<div style="font-size:12px; letter-spacing:0.5px; text-transform:uppercase; color:${MUTED}; margin-bottom:2px;">Amount</div>
    <div style="font-size:26px; font-weight:bold; color:${GOLD}; margin-bottom:12px;">${amount}</div>`;
}

function qrImg(src: string, alt: string): string {
  return `<img src="${src}" width="150" height="150" alt="${alt}" style="display:block; margin:0 auto 10px; border-radius:6px;" />`;
}

// The single-method block. Heading + how-to + one card.
export function paymentInstructionsHtml(order: SwellOrder): string {
  const number = orderNumberOf(order);
  const total = order.grand_total ?? 0;
  const amount = formatCurrency(total, order.currency || "USD");
  const method = chosenPaymentMethod(order);
  const colors = { ink: INK, muted: MUTED, gold: GOLD, cardBg: CARD_BG, border: BORDER };

  const heading = (label: string) =>
    `<h3 style="font-size:15px; margin: 24px 0 4px; border-bottom:1px solid ${BORDER}; padding-bottom:8px;">Complete your payment${label ? ` with ${label}` : ""}</h3>`;

  let body: string;
  switch (method) {
    case "venmo":
      body =
        heading("Venmo") +
        `<p style="font-size:14px; color:${MUTED}; margin-top:8px;">Tap the button and Venmo opens with the amount, recipient and order number already filled in. Just confirm and send.</p>` +
        card(
          `<div style="font-size:13px; font-weight:bold; letter-spacing:0.3px; color:${INK}; margin-bottom:10px;">VENMO</div>` +
            amountLine(amount) +
            button(`Pay ${amount} in Venmo`, venmoPayUrl(total, number)) +
            `<div style="font-size:12px; color:${MUTED}; margin:12px 0 8px;">or scan / search</div>` +
            qrImg(QR.venmo, "Venmo QR code") +
            `<div style="font-size:14px; color:${INK}; line-height:1.4;"><strong>@${VENMO_HANDLE}</strong><br/><span style="color:${MUTED};">Jeffery Coss</span></div>`
        );
      break;
    case "zelle":
      body =
        heading("Zelle") +
        `<p style="font-size:14px; color:${MUTED}; margin-top:8px;">Open your bank's app, choose Zelle, and send <strong style="color:${INK};">${amount}</strong> to the recipient below. Scanning the QR code from your bank's Zelle screen fills in the recipient for you.</p>` +
        card(
          `<div style="font-size:13px; font-weight:bold; letter-spacing:0.3px; color:${INK}; margin-bottom:10px;">ZELLE</div>` +
            amountLine(amount) +
            qrImg(QR.zelle, "Zelle QR code") +
            `<div style="font-size:14px; color:${INK}; line-height:1.5;">Send to <strong>marina@vitalitycertifiedpeptides.com</strong><br/><span style="color:${MUTED};">Shows as: Vitality Certified Peptides LLC Accounts (vcp-llc)</span></div>` +
            `<a href="${ZELLE_URL}" style="display:inline-block; margin-top:10px; font-size:12px; color:${GOLD}; text-decoration:underline;">Open in Zelle</a>`
        );
      break;
    case "apple_cash":
      body =
        heading("Apple Cash") +
        `<p style="font-size:14px; color:${MUTED}; margin-top:8px;">On your iPhone, tap the button to open Messages to our number, then use the Apple Cash button in the message bar to send <strong style="color:${INK};">${amount}</strong>. Put <strong style="color:${INK};">#${number}</strong> in the message.</p>` +
        card(
          `<div style="font-size:13px; font-weight:bold; letter-spacing:0.3px; color:${INK}; margin-bottom:10px;">APPLE CASH</div>` +
            amountLine(amount) +
            `<div style="font-size:16px; color:${INK}; line-height:1.4;"><strong>${APPLE_CASH_NUMBER}</strong></div>` +
            button("Open Messages", `${APPLE_CASH_SMS}&body=${encodeURIComponent(`VCP order #${number} - ${amount}`)}`)
        );
      break;
    case "paypal":
      body =
        heading("PayPal") +
        `<p style="font-size:14px; color:${MUTED}; margin-top:8px;">Send <strong style="color:${INK};">${amount}</strong> as <strong style="color:${INK};">Friends &amp; Family</strong>. Payments sent as Goods &amp; Services are returned and delay your order.</p>` +
        card(
          `<div style="font-size:13px; font-weight:bold; letter-spacing:0.3px; color:${INK}; margin-bottom:10px;">PAYPAL &mdash; FRIENDS &amp; FAMILY ONLY</div>` +
            amountLine(amount) +
            button("Open PayPal", PAYPAL_URL) +
            `<div style="font-size:12px; color:${MUTED}; margin:12px 0 8px;">or scan</div>` +
            qrImg(QR.paypal, "PayPal QR code") +
            `<div style="font-size:14px; color:${INK}; line-height:1.4;"><strong>Marina E Coss</strong><br/><span style="color:${MUTED};">marina@vitalitycertifiedpeptides.com</span></div>`
        );
      break;
    case "wire":
      body =
        heading("bank wire or ACH") +
        `<p style="font-size:14px; color:${MUTED}; margin-top:8px;">Send <strong style="color:${INK};">${amount}</strong> to the account below. The same instructions on letterhead are attached as a PDF for your bank.</p>` +
        wireCardHtml(number, colors, { headline: "BANK WIRE / ACH" });
      break;
    default:
      // Legacy / staff-created orders: the full grid, wire card on big orders.
      body =
        heading("") +
        `<p style="font-size:14px; color:${MUTED}; margin-top:8px;">Send the total above using <strong>ONE</strong> of the following:</p>` +
        paymentMethodCardsHtml() +
        (total >= WIRE_MIN_TOTAL ? wireCardHtml(number, colors) : "");
  }

  return (
    body +
    `<p style="margin-top:20px;">Put <strong>#${number}</strong> in the payment note or memo. Your order is not processed until payment is received. Once it arrives we approve the order, ship the same day (Monday through Friday), and email tracking with the Certificate of Analysis for your lot.</p>` +
    (method
      ? `<p style="font-size:14px; color:${MUTED};">Need to pay a different way than the one you selected? Reply to this email and we'll send the details.</p>`
      : `<p style="font-size:14px; color:${MUTED};">Once sent, reply to this email and tell us which method you used so we can match it up.</p>`)
  );
}

export function paymentInstructionsText(order: SwellOrder): string {
  const number = orderNumberOf(order);
  const total = order.grand_total ?? 0;
  const amount = formatCurrency(total, order.currency || "USD");
  const method = chosenPaymentMethod(order);
  let lines: string[];
  switch (method) {
    case "venmo":
      lines = [`Pay ${amount} with Venmo:`, `  Tap to pay (amount and note pre-filled): ${venmoPayUrl(total, number)}`, `  or send to @${VENMO_HANDLE} (Jeffery Coss)`];
      break;
    case "zelle":
      lines = [`Pay ${amount} with Zelle:`, `  Send to marina@vitalitycertifiedpeptides.com (Vitality Certified Peptides LLC Accounts, vcp-llc)`, `  ${ZELLE_URL}`];
      break;
    case "apple_cash":
      lines = [`Pay ${amount} with Apple Cash:`, `  Send to ${APPLE_CASH_NUMBER} from Messages and put #${number} in the message.`];
      break;
    case "paypal":
      lines = [`Pay ${amount} with PayPal, Friends & Family only:`, `  Marina E Coss - marina@vitalitycertifiedpeptides.com`, `  ${PAYPAL_URL}`];
      break;
    case "wire":
      lines = [`Pay ${amount} by bank wire or ACH:`, wireText(number), `  Beneficiary ${WIRE.beneficiary}. Wiring instructions on letterhead are attached.`];
      break;
    default:
      lines = [
        `To complete your order, send ${amount} using ONE of the following:`,
        `Zelle: vcp-llc (Vitality Certified Peptides LLC Accounts) - marina@vitalitycertifiedpeptides.com`,
        `Venmo: @${VENMO_HANDLE} (Jeffery Coss) - https://venmo.com/u/${VENMO_HANDLE}`,
        `Apple Cash: ${APPLE_CASH_NUMBER}`,
        `PayPal (Friends & Family only): Marina E Coss - marina@vitalitycertifiedpeptides.com - ${PAYPAL_URL}`,
        total >= WIRE_MIN_TOTAL ? wireText(number) : "",
      ].filter(Boolean);
  }
  lines.push(
    "",
    `Put #${number} in the payment note or memo. Your order is not processed until payment is received. Once it arrives we approve the order, ship the same day (Monday through Friday), and email tracking with the Certificate of Analysis for your lot.`,
    method
      ? "Need to pay a different way than the one you selected? Reply to this email and we'll send the details."
      : "Once sent, reply to this email and tell us which method you used so we can match it up."
  );
  return lines.join("\n");
}
