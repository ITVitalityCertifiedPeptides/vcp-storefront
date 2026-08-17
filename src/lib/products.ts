import "server-only";
import swell from "swell-js";

// NOTE: Swell option value prices are ADDITIVE - value.price is added to
// the product's base price when that value is selected.
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

// A subscription plan configured on the product's purchase options in the
// Swell admin (e.g. "Every 30 days"). When plans exist, the storefront
// shows the Restock & Save purchase toggle automatically.
export type SubscriptionPlan = {
  id: string;
  name: string;
};

export type Product = {
  // Swell product id, needed client-side for cart.addItem.
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  casNumber: string;
  description: string;
  price: number | null;
  ruoDisclaimer: string;
  stockLevel: number;
  // "in_stock" | "out_of_stock" | "backorder" | "preorder" | "discontinued" | null
  stockStatus: string | null;
  // Every product returned by the storefront API is implicitly active -
  // Swell excludes inactive products from this endpoint entirely, so an
  // inactive product (e.g. SLU-PP-332, HCG 10000IU) simply won't appear
  // here or get a page generated for it. stock_purchasable staying true
  // even at 0 stock is what keeps a product listed with pricing.
  inStock: boolean;
  // Size (or other) options configured in Swell. Empty array = single
  // variant product; cards can Add to Cart directly. Non-empty = the
  // product page shows a selector and cards say "Select Options".
  options: ProductOption[];
  // Subscription plans if Scheduled Restock is configured for this
  // product in Swell; null when not offered.
  subscription: SubscriptionPlan[] | null;
  // Lowest selectable price when options carry price differences, so
  // cards can show "From $X". Null when there's a single price.
  priceFrom: number | null;
  // Per-product Made in USA flag, read from the made_in_usa checkbox
  // content field in Swell (add it under Developer > Models > Products
  // alongside category/cas_number/ruo_disclaimer). Defaults to TRUE when
  // the field is absent, since the entire current catalog is US-made;
  // uncheck the box on any future product that isn't.
  madeInUsa: boolean;
};

// Display-layer renames pending a counsel-approved rename of the
// underlying Swell category values. The raw values (and the URL slugs
// derived from them) still carry consumer-benefit wording like "Weight
// Loss" and "Sexual Health"; these display names reframe every category
// as a research area so the most visible words on the site describe
// fields of study, not human outcomes. "Accessories" also becomes "Lab
// Supplies" here.
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

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const STORE_ID = process.env.NEXT_PUBLIC_SWELL_STORE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_SWELL_PUBLIC_KEY;

let initialized = false;
function ensureInit() {
  if (!STORE_ID || !PUBLIC_KEY) {
    throw new Error(
      "Missing NEXT_PUBLIC_SWELL_STORE_ID or NEXT_PUBLIC_SWELL_PUBLIC_KEY. " +
        "Set these in .env.local (see .env.example) or in the Vercel project's " +
        "Environment Variables."
    );
  }
  if (!initialized) {
    swell.init(STORE_ID, PUBLIC_KEY);
    initialized = true;
  }
}

// Shape of the fields swell-js returns for each product. Category, CAS
// Number, and RUO Disclaimer are custom fields set up in the Swell admin
// under Products > Content fields, so they come back on product.content.
type SwellProduct = {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  price?: number | null;
  stock_level?: number;
  stock_status?: string | null;
  content?: {
    category?: string;
    cas_number?: string;
    ruo_disclaimer?: string;
    made_in_usa?: boolean;
  };
  options?: Array<{
    id?: string;
    name?: string;
    active?: boolean;
    values?: Array<{ id?: string; name?: string; price?: number | null }>;
  }>;
  purchase_options?: {
    subscription?: {
      active?: boolean;
      plans?: Array<{ id?: string; name?: string; active?: boolean }>;
    };
  };
};

function mapProduct(p: SwellProduct): Product {
  const content = p.content || {};

  const options: ProductOption[] = (p.options || [])
    .filter((o) => o.active !== false && o.name && (o.values?.length || 0) > 0)
    .map((o) => ({
      id: o.id || o.name!,
      name: o.name!,
      values: (o.values || [])
        .filter((v) => v.name)
        .map((v) => ({
          id: v.id || v.name!,
          name: v.name!,
          price: v.price ?? null,
        })),
    }));

  const plans = (p.purchase_options?.subscription?.plans || []).filter(
    (plan) => plan.active !== false && plan.id
  );
  const subscription: SubscriptionPlan[] | null =
    p.purchase_options?.subscription?.active !== false && plans.length > 0
      ? plans.map((plan) => ({ id: plan.id!, name: plan.name || "Recurring" }))
      : null;

  // Option value prices are additive on top of the base price; the
  // cheapest selectable configuration is base + the lowest value delta.
  const base = p.price ?? null;
  let priceFrom: number | null = null;
  if (base != null && options.length > 0) {
    const deltas = options[0].values.map((v) => v.price ?? 0);
    const hasSpread = deltas.some((d) => d !== 0);
    if (hasSpread) priceFrom = base + Math.min(...deltas);
  }

  return {
    id: p.id,
    sku: p.sku || "",
    name: p.name,
    slug: slugify(p.name),
    category: content.category || "",
    casNumber: content.cas_number || "",
    description: p.description || "",
    price: base,
    ruoDisclaimer: content.ruo_disclaimer || "",
    stockLevel: p.stock_level || 0,
    stockStatus: p.stock_status ?? null,
    inStock: p.stock_status === "in_stock",
    options,
    subscription,
    priceFrom,
    madeInUsa: content.made_in_usa !== false,
  };
}

async function fetchAllProducts(): Promise<Product[]> {
  ensureInit();
  const all: SwellProduct[] = [];
  const limit = 100;
  let page = 1;

  for (;;) {
    const result = await swell.products.list({ limit, page });
    const results = (result?.results || []) as SwellProduct[];
    all.push(...results);
    if (results.length < limit) break;
    page++;
  }

  return all.map(mapProduct);
}

// Cache the in-flight/resolved fetch for the lifetime of this server
// process, so every page and layout that needs product data during a build
// (or a single request in dev) shares one Swell API call instead of firing
// one per route.
let cached: Promise<Product[]> | null = null;

export async function getAllProducts(): Promise<Product[]> {
  if (!cached) cached = fetchAllProducts();
  return cached;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug);
}

export async function getAllCategories(): Promise<string[]> {
  const products = await getAllProducts();
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );
  // Lab Supplies (raw value "Accessories") always sorts last: it's the
  // non-peptide catalog and should trail the research areas everywhere
  // categories are listed.
  return categories.sort((a, b) => {
    if (a === "Accessories") return 1;
    if (b === "Accessories") return -1;
    return 0;
  });
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.category === category);
}

export function categorySlug(category: string): string {
  return slugify(category);
}

export async function categoryFromSlug(slug: string): Promise<string | undefined> {
  const categories = await getAllCategories();
  return categories.find((c) => categorySlug(c) === slug);
}
