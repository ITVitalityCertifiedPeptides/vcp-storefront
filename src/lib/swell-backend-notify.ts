// Shared helpers for the swell-* webhook routes under src/app/api/webhooks/.
//
// Why this file exists: as of 2026-09-01, Swell's OWN native notification
// emails (Settings > Notifications - Order confirmation, canceled, refunded,
// Draft order invoice, Gift card, Abandoned cart, Shipping confirmation,
// Shipping update) do not reliably reach customers. Root cause, verified
// directly against vitalitycertifiedpeptides.com's live DNS:
//   - SPF: `v=spf1 include:_spf-usg2.ppe-hosted.com include:secureserver.net ~all`
//     - only authorizes GoDaddy/Proofpoint + the Microsoft 365 tenant that
//       hosts real staff email. Swell's own sending servers are not (and per
//       Swell's docs, cannot be) added to this record.
//   - DMARC: `v=DMARC1; p=quarantine; adkim=r; aspf=r; ...`
//   - Swell's notification "From email" setting (Settings > Notifications)
//     is a plain text field with zero domain-authentication support -
//     confirmed against Swell's own developer docs (developers.swell.is) and
//     help center. Swell sends every native notification from its own
//     infrastructure regardless of what "From" address is configured.
// Put together: any native Swell notification claiming to be from
// @vitalitycertifiedpeptides.com fails this domain's own SPF+DKIM, which
// DMARC's quarantine policy is specifically watching for. Confirmed live
// 2026-09-01: placed a real test order (#100005), the automatic Order
// confirmation email never reached Gmail (checked inbox/spam/trash,
// repeatedly, over several minutes).
//
// This is NOT fixable from inside Swell - there is no SPF/DKIM/custom-domain
// option anywhere in Swell's notification settings to add. The fix is to
// stop relying on Swell's native send entirely and replicate the pattern
// already proven working for the "Payment received" email
// (swell-order-paid/route.ts, live since 2026-08-21): a Swell webhook fires
// on the relevant event, a route here fetches the full resource from Swell's
// Backend API, and the email goes out via Resend - which IS authenticated on
// this domain (Resend's domain tab shows "Domain verified").
//
// Swell webhook payloads only carry {id, model, type, data: {id}} - never the
// full resource - so every route below fetches before emailing. See
// https://developers.swell.is/backend-api/webhooks

import "server-only";
import { sendEmail } from "@/lib/resend";
import { siteConfig } from "@/lib/site";

export type SwellWebhookBody = {
  type?: string;
  model?: string;
  data?: { id?: string; order_id?: string; account_id?: string };
};

export type SwellAccount = {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  group?: string;
  date_created?: string;
};

export type SwellOrder = {
  id: string;
  number?: string | number;
  email?: string;
  account?: { email?: string };
  billing?: { email?: string };
  shipping?: {
    email?: string;
    name?: string;
    address1?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  grand_total?: number;
  sub_total?: number;
  currency?: string;
  date_created?: string;
  status?: string;
  draft?: boolean;
  canceled?: boolean;
  refunded?: boolean;
  refund_total?: number;
  paid?: boolean;
  items?: Array<{
    product_name?: string;
    quantity?: number;
    price?: number;
  }>;
  shipments?: Array<{
    id?: string;
    date_created?: string;
    tracking_code?: string;
    tracking_url?: string;
    carrier?: string;
    service?: string;
    delivered?: boolean;
  }>;
  giftcards?: Array<{ id?: string; amount?: number; code?: string }>;
};

export type SwellCart = {
  id: string;
  email?: string;
  account?: { email?: string };
  grand_total?: number;
  currency?: string;
  items?: Array<{ product_name?: string; quantity?: number; price?: number }>;
  checkout_url?: string;
};

function auth(): string {
  const storeId = process.env.NEXT_PUBLIC_SWELL_STORE_ID;
  const secretKey = process.env.SWELL_SECRET_KEY;
  if (!storeId || !secretKey) {
    throw new Error("SWELL_SECRET_KEY / NEXT_PUBLIC_SWELL_STORE_ID not configured");
  }
  return Buffer.from(`${storeId}:${secretKey}`).toString("base64");
}

async function swellGet<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.swell.store${path}`, {
    headers: { Authorization: `Basic ${auth()}` },
  });
  if (!res.ok) {
    throw new Error(`Swell GET ${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

// `?expand=account` is required - confirmed live via Swell's Console
// (2026-09-01, order #100008) that GET /orders/{id} returns only
// `account_id` (a string) by default, NOT a nested `account` object. Every
// checkout we tested stored the customer's email solely on the linked
// Account record - order.email, order.billing.email, and
// order.shipping.email were all absent on the raw order. Without this
// expand, customerEmailFor() below never finds an email and every route
// silently falls back to the "no email on file" team alert instead of
// emailing the customer - this was the real reason order #100008's test
// still didn't reach the customer even after the Vercel firewall/env-var
// fixes were applied.
export async function fetchOrder(orderId: string): Promise<SwellOrder> {
  return swellGet<SwellOrder>(`/orders/${orderId}?expand=account`);
}

// Best-effort - Swell's Backend API reference does not document a top-level
// Carts endpoint as clearly as Orders. If this 404s, Josh/next session
// should check Swell admin (Developer > API Explorer, if it has one, or
// Console) for the real path and this one-line fetch is the only thing that
// needs correcting. Same `?expand=account` reasoning as fetchOrder above.
export async function fetchCart(cartId: string): Promise<SwellCart> {
  return swellGet<SwellCart>(`/carts/${cartId}?expand=account`);
}

// Used by the Customer Welcome replacement (swell-account-created/route.ts).
// Same Backend API pattern as fetchOrder/fetchCart above.
export async function fetchAccount(accountId: string): Promise<SwellAccount> {
  return swellGet<SwellAccount>(`/accounts/${accountId}`);
}

export function formatCurrency(amount: number | undefined, currency = "USD") {
  if (typeof amount !== "number") return "";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function customerEmailFor(order: SwellOrder | SwellCart): string | undefined {
  return order.email || order.account?.email || ("billing" in order ? order.billing?.email : undefined) || ("shipping" in order ? order.shipping?.email : undefined);
}

// ---------------------------------------------------------------------------
// Branded shell (2026-09-03) - every Resend email in this app now shares the
// exact visual system built for Order confirmation / Payment received
// (logo header, Georgia serif, gold accents, hosted images, matching
// footer), instead of the plain no-logo wrapper this file shipped with
// originally. Josh's direction: "everything should be built for [Resend] so
// that we have proper formatting and hosting for the images."
//
// Images are HOSTED (public/email-assets/*.png), never base64 - see the
// 2026-09-02 fix note in order-confirmation-email.ts for why (Gmail strips
// data: URIs).

export const BRAND = {
  gold: "#a67c27",
  ink: "#1a1a1a",
  muted: "#6b6b6b",
  border: "#e6e1d6",
  cardBg: "#faf8f3",
  green: "#2f7a3d",
  red: "#a13a3a",
} as const;

export const LOGO_EMBLEM_URL = `${siteConfig.url}/email-assets/logo-emblem.png`;

// Small colored pill shown just under the logo header, e.g. "ORDER CANCELED"
// or "SHIPMENT DELIVERED" - gives each notification type a distinct,
// glanceable identity the way the payment-received email's green
// "PAYMENT RECEIVED" pill already did, without needing a different layout
// per email.
export function badgeHtml(label: string, color: string = BRAND.gold): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin: 0 0 16px;">
    <tr>
      <td style="padding:6px 14px; background:${color}; border-radius:20px; text-align:center;">
        <span style="color:#ffffff; font-size:12px; font-weight:bold; letter-spacing:0.5px;">${label}</span>
      </td>
    </tr>
  </table>`;
}

// Generalized version of the Order/Total two-cell card used on Order
// confirmation and Payment received - accepts any number of {label, value}
// cells so Refund amount, Tracking number, etc. can reuse the same look.
export function summaryCardHtml(cells: Array<{ label: string; value: string; emphasize?: boolean }>): string {
  const tds = cells
    .map(
      (c, i) => `<td style="padding:14px 18px; ${i > 0 ? "text-align:right;" : ""}">
        <span style="font-size:12px; letter-spacing:0.5px; text-transform:uppercase; color:${BRAND.muted};">${c.label}</span><br/>
        <span style="font-size:18px; font-weight:bold; ${c.emphasize ? `color:${BRAND.gold};` : ""}">${c.value}</span>
      </td>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; background:${BRAND.cardBg}; border:1px solid ${BRAND.border}; border-radius:10px; margin: 16px 0;">
    <tr>${tds}</tr>
  </table>`;
}

// A gold, button-styled link - used for "Track your package", "Finish your
// order", etc. wherever a plain <a> isn't prominent enough.
export function ctaButtonHtml(label: string, url: string): string {
  return `<p style="margin:20px 0;">
    <a href="${url}" style="display:inline-block; background:${BRAND.gold}; color:#ffffff; text-decoration:none; padding:12px 26px; border-radius:24px; font-size:13px; font-weight:bold; letter-spacing:0.5px;">${label}</a>
  </p>`;
}

// The shared shell every automated email renders inside: logo header (gold
// rule underneath, matching Order confirmation/Payment received exactly),
// the caller's body content, then the standard footer/RUO line. Pass a
// badge via bodyHtml (badgeHtml() above) rather than as a separate param,
// so callers keep full control of ordering within the body.
export function wrapEmailHtml(bodyHtml: string): string {
  return `<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: ${BRAND.ink}; background:#ffffff;">
  <div style="padding: 28px 0 18px; text-align:center; border-bottom: 2px solid ${BRAND.gold};">
    <img src="${LOGO_EMBLEM_URL}" width="48" height="48" alt="Vitality Certified Peptides" style="display:block; margin:0 auto 10px;" />
    <span style="font-size: 19px; font-weight: bold; letter-spacing: 0.5px;">VITALITY <span style="font-weight: normal;">CERTIFIED PEPTIDES</span></span>
  </div>
  <div style="padding: 24px 8px; font-size: 15px; line-height: 1.6;">
    ${bodyHtml}
  </div>
  <div style="padding: 16px 8px; border-top: 1px solid ${BRAND.border}; font-size: 12px; color: ${BRAND.muted}; text-align:center;">
    Vitality Certified Peptides &middot; www.vitalitycertifiedpeptides.com<br/>
    Products are for laboratory research use only and are not for human or veterinary use.
  </div>
</div>`;
}

// Alert-the-team fallback used by every route below: if a resource has no
// resolvable customer email, don't silently drop the notification - tell a
// human so they can follow up manually.
export async function alertTeamNoEmail(kind: string, id: string | number) {
  await sendEmail({
    to: "customerservice@vitalitycertifiedpeptides.com",
    subject: `[Action needed] No customer email found for ${kind} #${id}`,
    text: `${kind} ${id} triggered a notification webhook but no customer email was found on the record. Please follow up manually.`,
    html: `<p><strong>${kind} ${id}</strong> triggered a notification webhook but no customer email was found on the record. Please follow up manually.</p>`,
  });
}

// Same bordered, gold-ruled table used on Order confirmation/Payment
// received - promoted here so every email (canceled/refunded/draft
// invoice/abandoned cart/shipment) shows line items in the same style
// instead of the old bare 3-column table with no header or shading.
export function itemsListHtml(items: SwellOrder["items"] | SwellCart["items"], currency = "USD"): string {
  if (!items || items.length === 0) return "";
  const rows = items
    .map((i) => {
      const price = formatCurrency(i.price, currency);
      const qty = i.quantity ?? 1;
      const lineTotal = formatCurrency((i.price ?? 0) * qty, currency);
      return `<tr>
        <td style="padding:10px 8px; border-bottom:1px solid ${BRAND.border}; font-size:14px; color:${BRAND.ink};">${i.product_name ?? "Item"}</td>
        <td style="padding:10px 8px; border-bottom:1px solid ${BRAND.border}; font-size:14px; color:${BRAND.muted}; text-align:center;">x${qty}</td>
        <td style="padding:10px 8px; border-bottom:1px solid ${BRAND.border}; font-size:14px; color:${BRAND.muted}; text-align:right;">${price}</td>
        <td style="padding:10px 8px; border-bottom:1px solid ${BRAND.border}; font-size:14px; color:${BRAND.ink}; text-align:right; font-weight:bold;">${lineTotal}</td>
      </tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:16px 0;">
    <thead>
      <tr>
        <th align="left" style="padding:0 8px 8px; font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:${BRAND.muted}; border-bottom:2px solid ${BRAND.gold};">Item</th>
        <th align="center" style="padding:0 8px 8px; font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:${BRAND.muted}; border-bottom:2px solid ${BRAND.gold};">Qty</th>
        <th align="right" style="padding:0 8px 8px; font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:${BRAND.muted}; border-bottom:2px solid ${BRAND.gold};">Price</th>
        <th align="right" style="padding:0 8px 8px; font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:${BRAND.muted}; border-bottom:2px solid ${BRAND.gold};">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

export function checkAuth(request: Request): boolean {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const expected = process.env.SWELL_WEBHOOK_SECRET;
  return Boolean(expected) && token === expected;
}
