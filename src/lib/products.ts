import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export type Product = {
  sku: string;
  name: string;
  slug: string;
  category: string;
  casNumber: string;
  description: string;
  price: number | null;
  active: boolean;
  ruoDisclaimer: string;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

let cached: Product[] | null = null;

export function getAllProducts(): Product[] {
  if (cached) return cached;

  const csvPath = path.join(process.cwd(), "src/data/products.csv");
  const raw = fs.readFileSync(csvPath, "utf-8");
  const rows: Array<Record<string, string>> = parse(raw, {
    columns: true,
    skip_empty_lines: true,
  });

  cached = rows.map((row) => ({
    sku: row.sku || "",
    name: row.name,
    slug: slugify(row.name),
    category: row.category,
    casNumber: row.cas_number,
    description: row.description,
    price: row.price ? parseFloat(row.price) : null,
    active: String(row.active).toUpperCase() === "TRUE",
    ruoDisclaimer: row.ruo_disclaimer,
  }));

  return cached;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getAllCategories(): string[] {
  const categories = new Set(getAllProducts().map((p) => p.category));
  return Array.from(categories);
}

export function getProductsByCategory(category: string): Product[] {
  return getAllProducts().filter((p) => p.category === category);
}

export function categorySlug(category: string): string {
  return slugify(category);
}

export function categoryFromSlug(slug: string): string | undefined {
  return getAllCategories().find((c) => categorySlug(c) === slug);
}
