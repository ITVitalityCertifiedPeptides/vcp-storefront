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
// file, for how F&F pricing works.
//
// 2026-09-05 (Josh: "we do want to sell the GLP class of peptides but we
// do not want them visible until you login... after someone has created
// an account"): a NEW, narrower gate is back, scoped to just the GLP-1
// compound family - isGlp1 below, computed once in products.ts's
// mapProduct() from the same name-substring match
// set-glp1-retail-off.js already uses. Every other product is
// unaffected: no group/approval concept like the old researcher-gate or
// Inner Circle/Wholesale's staff-approval queues - any Swell account
// unlocks every GLP-1 product instantly (see lib/session.ts). Login
// state itself is checked per-surface (product page, shop, category,
// search, homepage - see each file's own comment), not here; this file
// only carries the flag and the one shared filter every surface calls.

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
  // True for the GLP-1 compound family (semaglutide, tirzepatide,
  // retatrutide, cagrilintide, liraglutide, survodutide) - see
  // products.ts's isGlp1Name() for the exact match.
  isGlp1: boolean;
};

// Single choke-point every listing surface calls to drop GLP-1 products
// for a visitor without access, instead of scattering the check across
// components. hasGlp1Access is a plain boolean (any signed-in Swell
// account = access, see current-session.ts) - there's no group/tier to
// pass through here.
export function filterVisible(products: Product[], hasGlp1Access: boolean): Product[] {
  if (hasGlp1Access) return products;
  return products.filter((p) => !p.isGlp1);
}

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
