// Catalog types + display helpers shared by server AND client code.
// products.ts (server-only, talks to Swell) re-exports everything here,
// so server modules keep importing from "@/lib/products"; client
// components import from this file directly to avoid pulling the
// server-only guard into the client bundle.
//
// 2026-08-31 (Josh): retail no longer gates pricing or catalog visibility
// behind a login. Pricing is public everywhere, to every visitor, so the
// researcher-gate fields that used to live on Product - researcherOnly
// (hid a product entirely pre-approval) and friendsFamilyPrice (a
// discount shown only to friends-family accounts) - are gone from this
// store. Friends & Family is now its own separate Swell storefront with
// its own product line and pricing; see that project's docs, not this
// file, for how F&F pricing works. filterVisible() is gone with them -
// every caller now just uses the product list Swell returns directly.

export type ProductOptionValue = {
  id: string;
  name: string;
  price: number | null;
};

export type ProductOption = {
  id: string;
  name: string;
  values: ProductOptionValue[];
};

export type SubscriptionPlan = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  // All research areas (raw category values): primary category first,
  // then literature-supported secondary areas of study.
  areas: string[];
  casNumber: string;
  description: string;
  price: number | null;
  ruoDisclaimer: string;
  stockLevel: number;
  stockStatus: string | null;
  inStock: boolean;
  options: ProductOption[];
  subscription: SubscriptionPlan[] | null;
  priceFrom: number | null;
  madeInUsa: boolean;
  // Gallery image URLs discovered server-side from public/products
  // (see lib/product-gallery.ts): hero first, then molecule card(s).
  images: string[];
};

// Display-layer renames pending a counsel-approved rename of the
// underlying Swell category values (raw values and URL slugs still carry
// the original wording).
const CATEGORY_DISPLAY: Record<string, string> = {
  "Metabolic/Weight Loss": "Metabolic Research",
  "Growth Hormone/Endocrine": "Endocrine Research",
  "Inflammation/Recovery": "Tissue & Inflammation Research",
  "Cellular Repair/Longevity": "Cellular & Longevity Research",
  "Immune Support": "Immunology Research",
  Nootropic: "Neurological Research",
  "Skin/Cosmetic": "Dermal Research",
  "Sexual Health": "Reproductive Research",
  Sleep: "Sleep Research",
  Accessories: "Lab Supplies",
};

export function displayCategory(category: string): string {
  return CATEGORY_DISPLAY[category] || category;
}
