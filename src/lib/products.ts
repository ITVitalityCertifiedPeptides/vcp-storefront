import "server-only";
import swell from "swell-js";
import { galleryImages } from "./product-gallery";
import { secondaryAreasFor } from "./research-areas";
import type {
  Product,
  ProductOption,
  SubscriptionPlan,
} from "./catalog-shared";

// Types + display helpers live in catalog-shared.ts (no server-only
// guard) so client components can use them too; re-exported here so
// server code keeps one import path.
export { displayCategory } from "./catalog-shared";
export type {
  Product,
  ProductOption,
  ProductOptionValue,
  SubscriptionPlan,
} from "./catalog-shared";

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
  active?: boolean;
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

  const primaryArea = content.category || "";
  // Full list of research areas: the Swell category first, then any
  // literature-supported secondary areas (see lib/research-areas.ts),
  // deduplicated in case a secondary ever matches the primary.
  const areas = [
    primaryArea,
    ...secondaryAreasFor(p.name).filter((a) => a && a !== primaryArea),
  ].filter(Boolean);

  return {
    id: p.id,
    sku: p.sku || "",
    name: p.name,
    slug: slugify(p.name),
    category: primaryArea,
    areas,
    casNumber: content.cas_number || "",
    description: p.description || "",
    price: base,
    ruoDisclaimer: content.ruo_disclaimer || "",
    stockLevel: p.stock_level || 0,
    stockStatus: p.stock_status ?? null,
    // 2026-09-01 (Josh): native Swell backorder is on for every active
    // product (enable-backorder-all-products.js), which means a
    // zero-stock product still ships an order fine - Swell just marks it
    // stock_status "backorder" instead of "in_stock". `inStock` used to
    // mean literally "stock_status is in_stock", which made every
    // backordered product look (and act, see QuickAdd/BuyBox) sold out
    // even though it was fully purchasable. Redefined to mean
    // "purchasable": true unless Swell explicitly says out_of_stock (or a
    // product somehow has no stock_status at all, e.g. stock_tracking is
    // off, which also means nothing is blocking a sale).
    inStock: p.stock_status !== "out_of_stock",
    options,
    subscription,
    priceFrom,
    madeInUsa: content.made_in_usa !== false,
    images: galleryImages(slugify(p.name)),
  };
}

// Swell's API intermittently fails a request outright during a Vercel build
// ("connection_error"), which is enough to fail the whole build: every static
// product page and sitemap.xml funnel through fetchAllProducts. Retry the
// individual list call a couple of times before giving up - the failures are
// transient, so a short pause is usually all it takes.
const MAX_ATTEMPTS = 3;
// Linear backoff: 1s before the second attempt, 2s before the third.
const RETRY_BASE_DELAY_MS = 1_000;

async function withRetry<T>(label: string, fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      // Out of attempts: fall through and rethrow rather than sleeping for
      // nothing.
      if (attempt === MAX_ATTEMPTS) break;
      const delay = attempt * RETRY_BASE_DELAY_MS;
      console.warn(
        `Swell request failed (${label}, attempt ${attempt} of ` +
          `${MAX_ATTEMPTS}); retrying in ${delay}ms`,
        error
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

async function fetchAllProducts(): Promise<Product[]> {
  ensureInit();
  const all: SwellProduct[] = [];
  const limit = 100;
  let page = 1;

  for (;;) {
    const result = await withRetry(`products.list page ${page}`, () =>
      swell.products.list({ limit, page })
    );
    const results = (result?.results || []) as SwellProduct[];
    all.push(...results);
    if (results.length < limit) break;
    page++;
  }

  // Belt-and-braces on Swell's own "active" toggle (Swell admin > product >
  // Active). We init with the Frontend API key, which is expected to return
  // only active products and may not send `active` at all - in which case
  // this is a no-op. `active !== false` deliberately keeps anything where the
  // field is missing, so it can never drop a product the API declined to
  // label; it only bites if the field does start arriving. This was NOT the
  // reason Bacteriostatic Water 30mL kept rendering after being deactivated
  // in Swell - see the cache note below for that.
  return all.filter((p) => p.active !== false).map(mapProduct);
}

// Share one Swell API call across every page and layout that needs product
// data during a build (or a single render pass in dev) instead of firing one
// per route - but expire the entry rather than holding it for the lifetime of
// the process. A permanent cache silently defeats the hourly refresh that
// layout.tsx sets up (`export const revalidate = 3600`): the ISR pass reruns
// in the same server process, gets this pinned array back, and re-renders the
// catalog exactly as it looked at boot. That is why a product deactivated in
// Swell (Bacteriostatic Water 30mL) kept rendering for weeks - not a missing
// active-flag check. Sixty seconds is long enough to dedupe a whole build's
// worth of routes and short enough that the next regeneration sees Swell.
const CACHE_TTL_MS = 60_000;
let cached: { at: number; promise: Promise<Product[]> } | null = null;

export async function getAllProducts(): Promise<Product[]> {
  if (!cached || Date.now() - cached.at > CACHE_TTL_MS) {
    const promise = fetchAllProducts();
    cached = { at: Date.now(), promise };
    // Never pin a failed fetch: caching a rejected promise would make every
    // later call fail for as long as the entry lived, turning one blip in the
    // Swell API into a permanently empty catalog.
    promise.catch(() => {
      if (cached?.promise === promise) cached = null;
    });
  }
  return cached.promise;
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
  // A product appears on every research-area page it is studied under,
  // not only its primary category.
  return products.filter((p) => p.areas.includes(category));
}

export function categorySlug(category: string): string {
  return slugify(category);
}

export async function categoryFromSlug(slug: string): Promise<string | undefined> {
  const categories = await getAllCategories();
  return categories.find((c) => categorySlug(c) === slug);
}
