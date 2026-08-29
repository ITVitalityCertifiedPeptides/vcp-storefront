"use client";

import swell from "swell-js";

// Client-side Swell instance for cart operations. Uses the same public
// (frontend) credentials as the server-side product fetch in products.ts;
// the public key is safe in the browser by design and cannot write to the
// catalog. Checkout itself happens on Swell's hosted checkout page
// (cart.checkout_url), so no payment data ever touches this codebase.

let initialized = false;

export function getSwell() {
  if (!initialized) {
    swell.init(
      process.env.NEXT_PUBLIC_SWELL_STORE_ID || "",
      process.env.NEXT_PUBLIC_SWELL_PUBLIC_KEY || ""
    );
    initialized = true;
  }
  return swell;
}

// Loose shapes for the parts of Swell's cart responses we actually use.
export type SwellCartItem = {
  id: string;
  quantity: number;
  price?: number;
  price_total?: number;
  product?: { name?: string };
  // Friends & Family (2026-08-29): the per-item amount knocked off by any
  // applied Promotion (see sync-friends-family-pricing.js). Swell computes
  // this automatically once a matching product+customer-group Promotion
  // applies to the cart - nothing client-side triggers it.
  discount_total?: number;
};

export type SwellCart = {
  item_quantity?: number;
  checkout_url?: string;
  sub_total?: number;
  grand_total?: number;
  items?: SwellCartItem[];
  // Friends & Family (2026-08-29): cart-level sum of every item's
  // discount_total. Shown as a "Friends & Family Discount" line on the
  // cart page when > 0.
  discount_total?: number;
};
