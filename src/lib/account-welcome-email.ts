// "Customer welcome" replacement for retail (2026-09-03) - Swell's own
// native "Customer welcome" notification is generic default copy and, like
// every other native send, fails this domain's SPF/DMARC policy (see the
// root-cause writeup at the top of swell-backend-notify.ts). This route
// replicates the same webhook -> fetch -> Resend pattern already proven for
// every other notification.
//
// IMPORTANT - this only covers genuinely public retail signups. Inner
// Circle and Wholesale accounts are also created on this same shared Swell
// store (via their own apps' server-side createPendingAccount() calls), and
// each of those apps already sends its own tailored applicant-welcome email
// the moment someone registers. Since Swell's account-created event fires
// regardless of which app/API created the record, the webhook route below
// explicitly SKIPS sending this generic retail welcome for any account in
// the "pending", "friends-family", or "wholesale" groups - otherwise every
// Circle/Wholesale applicant would get two different welcome emails. See
// swell-account-created/route.ts.

import "server-only";
import { LOGO_EMBLEM_URL, BRAND } from "./swell-backend-notify";

export function buildAccountWelcomeEmailHtml(firstName: string): string {
  const name = firstName || "there";
  return `<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: ${BRAND.ink}; background:#ffffff;">
  <div style="padding: 28px 0 18px; text-align:center; border-bottom: 2px solid ${BRAND.gold};">
    <img src="${LOGO_EMBLEM_URL}" width="48" height="48" alt="Vitality Certified Peptides" style="display:block; margin:0 auto 10px;" />
    <span style="font-size: 19px; font-weight: bold; letter-spacing: 0.5px;">VITALITY <span style="font-weight: normal;">CERTIFIED PEPTIDES</span></span>
  </div>

  <div style="padding: 24px 8px; font-size: 15px; line-height: 1.6;">
    <p style="margin-top:0;">Hi ${name},</p>
    <p>Thanks for creating an account with Vitality Certified Peptides. You're all set - sign in any time to check order history, save shipping details, and reorder in a couple clicks.</p>

    <p style="margin:20px 0;">
      <a href="https://www.vitalitycertifiedpeptides.com/shop" style="display:inline-block; background:${BRAND.gold}; color:#ffffff; text-decoration:none; padding:12px 26px; border-radius:24px; font-size:13px; font-weight:bold; letter-spacing:0.5px;">Browse the catalog</a>
    </p>

    <p style="font-size:12px; color:${BRAND.muted}; margin-top:20px;">All products are for laboratory research use only and are not for human or veterinary use.</p>

    <p style="margin-top:20px;">Questions? Just reply to this email.</p>
  </div>

  <div style="padding: 16px 8px; border-top: 1px solid ${BRAND.border}; font-size: 12px; color: ${BRAND.muted}; text-align:center;">
    Vitality Certified Peptides &middot; www.vitalitycertifiedpeptides.com
  </div>
</div>`;
}

export function buildAccountWelcomeEmailText(firstName: string): string {
  const name = firstName || "there";
  return `Hi ${name},

Thanks for creating an account with Vitality Certified Peptides. You're all set - sign in any time to check order history, save shipping details, and reorder in a couple clicks.

Browse the catalog: https://www.vitalitycertifiedpeptides.com/shop

All products are for laboratory research use only and are not for human or veterinary use.

Questions? Just reply to this email.

Vitality Certified Peptides
www.vitalitycertifiedpeptides.com`;
}
