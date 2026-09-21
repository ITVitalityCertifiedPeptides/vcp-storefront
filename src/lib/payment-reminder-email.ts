// Automated "we haven't received your payment" emails (2026-09-21).
// Sent by /api/cron/payment-reminders at 4h, 12h and 48h after an unpaid
// order is placed. Same one-method payment block as the order email
// (lib/payment-instructions.ts), so the customer sees exactly what they
// picked at checkout with the amount filled in.

import "server-only";
import type { SwellOrder } from "./swell-backend-notify";
import { formatCurrency } from "./swell-backend-notify";
import { siteConfig } from "./site";
import { paymentInstructionsHtml, paymentInstructionsText, orderNumberOf } from "./payment-instructions";

const LOGO_EMBLEM_URL = `${siteConfig.url}/email-assets/logo-emblem.png`;
const GOLD = "#a67c27";
const INK = "#1a1a1a";
const MUTED = "#6b6b6b";
const BORDER = "#e6e1d6";
const CARD_BG = "#faf8f3";

export type ReminderStage = {
  key: "4h" | "12h" | "48h";
  hours: number;
  subject: (n: string) => string;
  eyebrow: string;
  intro: string;
};

export const REMINDER_STAGES: ReminderStage[] = [
  {
    key: "4h",
    hours: 4,
    subject: (n) => `Payment reminder - order #${n}`,
    eyebrow: "Payment reminder",
    intro:
      "A quick reminder that we haven't received payment for your order yet. It's on hold until we do. If you've already sent it, please ignore this email; we confirm payments Monday through Friday during business hours and will match it up.",
  },
  {
    key: "12h",
    hours: 12,
    subject: (n) => `Still waiting on payment - order #${n}`,
    eyebrow: "Second reminder",
    intro:
      "We're still waiting on payment for your order, so it hasn't been processed. If you've already sent it, please ignore this email. If something didn't work, just reply and we'll help.",
  },
  {
    key: "48h",
    hours: 48,
    subject: (n) => `Final reminder - order #${n}`,
    eyebrow: "Final reminder",
    intro:
      "This is our last reminder about your unpaid order. It stays on hold until payment arrives. If you've already paid, please ignore this. If you'd rather cancel, reply and let us know and we'll release the items.",
  },
];

export function buildPaymentReminderHtml(order: SwellOrder, stage: ReminderStage): string {
  const number = orderNumberOf(order);
  const amount = formatCurrency(order.grand_total, order.currency || "USD");
  const first = order.shipping?.first_name || order.account?.first_name || (order.shipping?.name || "").split(" ")[0] || "there";
  const placed = order.date_created
    ? new Date(order.date_created).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "America/Los_Angeles" })
    : "recently";
  return `<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: ${INK}; background:#ffffff;">
  <div style="padding: 28px 0 18px; text-align:center; border-bottom: 2px solid ${GOLD};">
    <img src="${LOGO_EMBLEM_URL}" width="48" height="48" alt="Vitality Certified Peptides" style="display:block; margin:0 auto 10px;" />
    <span style="font-size: 19px; font-weight: bold; letter-spacing: 0.5px;">VITALITY <span style="font-weight: normal;">CERTIFIED PEPTIDES</span></span>
    <div style="font-size:11px; letter-spacing:1px; text-transform:uppercase; color:${GOLD}; margin-top:4px;">${stage.eyebrow}</div>
  </div>
  <div style="padding: 24px 8px; font-size: 15px; line-height: 1.6;">
    <p style="margin-top:0;">Hi ${first},</p>
    <p>${stage.intro}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; background:${CARD_BG}; border:1px solid ${BORDER}; border-radius:10px; margin: 16px 0;">
      <tr>
        <td style="padding:14px 18px;"><span style="font-size:12px; letter-spacing:0.5px; text-transform:uppercase; color:${MUTED};">Order</span><br/><span style="font-size:18px; font-weight:bold;">#${number}</span><br/><span style="font-size:12px; color:${MUTED};">placed ${placed}</span></td>
        <td style="padding:14px 18px; text-align:right;"><span style="font-size:12px; letter-spacing:0.5px; text-transform:uppercase; color:${MUTED};">Amount due</span><br/><span style="font-size:18px; font-weight:bold; color:${GOLD};">${amount}</span></td>
      </tr>
    </table>
    ${paymentInstructionsHtml(order)}
    <p style="font-size:12px; color:${MUTED}; margin-top:20px;">Reminder: all products are for laboratory research use only and are not for human or veterinary use.</p>
  </div>
  <div style="padding: 16px 8px; border-top: 1px solid ${BORDER}; font-size: 12px; color: ${MUTED}; text-align:center;">Vitality Certified Peptides &middot; www.vitalitycertifiedpeptides.com</div>
</div>`;
}

export function buildPaymentReminderText(order: SwellOrder, stage: ReminderStage): string {
  const number = orderNumberOf(order);
  const amount = formatCurrency(order.grand_total, order.currency || "USD");
  const first = order.shipping?.first_name || order.account?.first_name || "there";
  return `Hi ${first},

${stage.intro}

Order #${number} - Amount due ${amount}

${paymentInstructionsText(order)}

Vitality Certified Peptides
www.vitalitycertifiedpeptides.com

All products are for laboratory research use only and are not for human or veterinary use.`;
}
