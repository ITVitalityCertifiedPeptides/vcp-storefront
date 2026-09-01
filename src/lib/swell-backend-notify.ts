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

export type SwellWebhookBody = {
  type?: string;
  model?: string;
  data?: { id?: string; order_id?: string };
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

export async function fetchOrder(orderId: string): Promise<SwellOrder> {
  return swellGet<SwellOrder>(`/orders/${orderId}`);
}

// Best-effort - Swell's Backend API reference does not document a top-level
// Carts endpoint as clearly as Orders. If this 404s, Josh/next session
// should check Swell admin (Developer > API Explorer, if it has one, or
// Console) for the real path and this one-line fetch is the only thing that
// needs correcting.
export async function fetchCart(cartId: string): Promise<SwellCart> {
  return swellGet<SwellCart>(`/carts/${cartId}`);
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

// Consistent, simple branded wrapper so all 9 emails look like they came
// from the same system, without needing to embed the logo/QR images that
// invoice_email.html uses (those are for the one manually-sent, fully
// designed invoice - these are automated and text-first by design, same
// spirit as the existing Template 3 payment-received email).
export function wrapEmailHtml(bodyHtml: string): string {
  return `<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
  <div style="padding: 24px 0 16px; border-bottom: 2px solid #a67c27;">
    <span style="font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">VITALITY <span style="font-weight: normal;">CERTIFIED PEPTIDES</span></span>
  </div>
  <div style="padding: 24px 0; font-size: 15px; line-height: 1.6;">
    ${bodyHtml}
  </div>
  <div style="padding: 16px 0; border-top: 1px solid #ddd; font-size: 12px; color: #777;">
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

export function itemsListHtml(items: SwellOrder["items"] | SwellCart["items"]): string {
  if (!items || items.length === 0) return "";
  const rows = items
    .map(
      (i) =>
        `<tr><td style="padding:4px 8px 4px 0;">${i.product_name ?? "Item"}</td><td style="padding:4px 8px;">x${i.quantity ?? 1}</td><td style="padding:4px 0 4px 8px; text-align:right;">${formatCurrency(i.price)}</td></tr>`
    )
    .join("");
  return `<table style="width:100%; border-collapse:collapse; margin:12px 0; font-size:14px;">${rows}</table>`;
}

export function checkAuth(request: Request): boolean {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const expected = process.env.SWELL_WEBHOOK_SECRET;
  return Boolean(expected) && token === expected;
}
