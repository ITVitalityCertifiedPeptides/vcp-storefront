// The ways a customer can pay an invoice, picked at checkout (2026-09-21).
// The choice is stored on the order as metadata.payment_method and drives
// the confirmation + reminder emails, which show ONLY the chosen method
// with a pre-filled pay link where the service supports one.
//
// Same file in vcp-storefront and ff-app; the storefront's
// lib/payment-instructions.ts (server side) turns these ids into email
// content. Keep the ids stable: the staff portal and Swell metadata use them.

export type PaymentMethodId = "zelle" | "venmo" | "apple_cash" | "paypal" | "wire";

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  blurb: string;
  // Only offered when the order total is at least this much.
  minTotal?: number;
};

export const WIRE_MIN_TOTAL = 1000;

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "zelle", label: "Zelle", blurb: "Send from your bank's app. No fees." },
  { id: "venmo", label: "Venmo", blurb: "Tap a link in your email and Venmo opens with the amount filled in." },
  { id: "apple_cash", label: "Apple Cash", blurb: "Send from Messages on your iPhone." },
  { id: "paypal", label: "PayPal (Friends & Family)", blurb: "Friends & Family only. Goods & Services payments are returned." },
  { id: "wire", label: "Bank Wire / ACH", blurb: "Wiring instructions on letterhead come with your invoice.", minTotal: WIRE_MIN_TOTAL },
];

export function paymentMethodsFor(total: number): PaymentMethod[] {
  return PAYMENT_METHODS.filter((m) => !m.minTotal || total >= m.minTotal);
}

export function paymentMethodLabel(id: string | undefined | null): string | null {
  return PAYMENT_METHODS.find((m) => m.id === id)?.label ?? null;
}

export function isPaymentMethodId(v: unknown): v is PaymentMethodId {
  return typeof v === "string" && PAYMENT_METHODS.some((m) => m.id === v);
}

// Swell shipping service id for approved local pickup (added to Settings >
// Shipping by scripts/add-pickup-service.js). $0, no carrier.
export const PICKUP_SERVICE_ID = "pickup";
export const PICKUP_REQUEST_EMAIL = "customerservice@vitalitycertifiedpeptides.com";
