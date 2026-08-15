import "server-only";
import swell from "swell-js";

export type Product = {
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
};

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
  };
};

function mapProduct(p: SwellProduct): Product {
  const content = p.content || {};
  return {
    sku: p.sku || "",
    name: p.name,
    slug: slugify(p.name),
    category: content.category || "",
    casNumber: content.cas_number || "",
    description: p.description || "",
    price: p.price ?? null,
    ruoDisclaimer: content.ruo_disclaimer || "",
    stockLevel: p.stock_level || 0,
    stockStatus: p.stock_status ?? null,
    inStock: p.stock_status === "in_stock",
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
  const categories = new Set(products.map((p) => p.category).filter(Boolean));
  return Array.from(categories);
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
