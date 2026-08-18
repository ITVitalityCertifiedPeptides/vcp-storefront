// Tapfiliate affiliate tracking (account vitalitycertifiedpeptides,
// program "Vitality Certified Peptides Affiliate Program").
//
// - <TapfiliateTracker /> in the root layout loads the script and runs
//   click detection (tap('detect')) so ?ref= affiliate links set the
//   30-day referral cookie.
// - trackConversion() is called from checkout right after a successful
//   submitOrder. It reports the order number, the PRODUCT SUBTOTAL
//   (commission excludes shipping/tax per the program terms), and the
//   buyer's email as customer_id so lifetime/recurring commissions
//   attribute this customer's future reorders to the referring affiliate.
//
// Calls made before the remote script loads are queued by the stub below
// (same mechanism as Tapfiliate's official snippet), so ordering is safe.

export const TAPFILIATE_ACCOUNT_ID = "64391-1312cb";

type TapQueued = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    tap?: TapQueued;
    TapfiliateObject?: string;
  }
}

export function tap(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  window.TapfiliateObject = "tap";
  if (!window.tap) {
    const stub: TapQueued = (...queued: unknown[]) => {
      stub.q = stub.q || [];
      stub.q.push(queued);
    };
    window.tap = stub;
  }
  window.tap(...args);
}

export function trackConversion(
  orderId: string,
  amount: number,
  customerId: string
): void {
  if (!orderId) return;
  tap("conversion", orderId, amount, customerId ? { customer_id: customerId } : undefined);
}
