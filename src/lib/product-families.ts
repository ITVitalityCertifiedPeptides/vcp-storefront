// Product families: one shop tile per compound-and-form, sizes chosen on
// the product page.
//
// 2026-09-06 (Josh): "if you want BPC-157, you have to select which
// quantity you want within a drop down ... that would reduce the total
// amount of products listed in the shopping experience dramatically."
//
// Swell still holds one product per size (BPC-157 5mg, BPC-157 10mg, ...)
// and nothing about pricing, inventory, ShipStation, or the Circle /
// wholesale price fields changes. This module only GROUPS those products
// for display, purely from the product name, using the catalog's own
// naming conventions (see VCP_Master_Catalog.xlsx):
//
//   Vials:            "<Base> <size>mg"          BPC-157 10mg, HCG 5000IU,
//                                                BAC Water 30mL (Saline),
//                                                Semax/Selank 10/10mg
//   Nasal sprays:     "<Base> - <mg> . <mcg>/spray"
//   Strips/tablets/
//   capsules:         "<Base> - <dose> x <count> strips"
//   Ampules:          "<Base> Cosmetic Ampules x5"
//
// A family is base name + form, so "BPC-157" (vials), "BPC-157 Nasal
// Spray", and "BPC-157 Strips" are three tiles. Sizes within a family
// fold into one tile. Products whose name carries no size are a family
// of one and render exactly as before.
//
// Pure functions, no I/O, shared verbatim between retail and Circle.

export type ProductForm = "Vial" | "Nasal Spray" | "Strips" | "Tablets" | "Capsules" | "Ampules";

const FORM_KEYS: Array<[string, ProductForm]> = [
  ["/spray", "Nasal Spray"],
  ["per spray", "Nasal Spray"],
  ["strips", "Strips"],
  ["tablets", "Tablets"],
  ["capsules", "Capsules"],
  ["ampules", "Ampules"],
];

export type NameParts = {
  base: string;
  // Human size label, "" when the name carries none. Examples: "10mg",
  // "5/5mg", "30mL (Saline)", "10mg · 7mcg/spray", "0.5mg x 30".
  size: string;
  form: ProductForm;
};

export function splitProductName(name: string): NameParts {
  const n = name.trim();
  const low = n.toLowerCase();
  let form: ProductForm = "Vial";
  for (const [key, f] of FORM_KEYS) {
    if (low.includes(key)) {
      form = f;
      break;
    }
  }
  if (form !== "Vial" && n.includes(" - ")) {
    const [base, rest] = n.split(" - ", 2);
    let size = rest.trim();
    const count = size.match(/x\s*(\d+)/i);
    // "0.5mg x 30 strips" -> "0.5mg x 30"; "10mg . 7mcg/spray" -> "10mg · 7mcg/spray"
    size = size.replace(/\s*x\s*\d+\s*(strips|tablets|capsules)\s*$/i, "").trim();
    if (count && (form === "Strips" || form === "Tablets" || form === "Capsules")) {
      size = `${size} x ${count[1]}`;
    }
    // Only the spaced " . " separator between mg and mcg/spray becomes a
    // middle dot; decimals like 0.5mg are left alone.
    size = size.replace(/\s+\.\s+/g, " · ");
    return { base: base.trim(), size, form };
  }
  const m = n.match(/^(.*?)\s+(\d[\d./]*\s*(?:mg|mcg|IU|mL)\b.*)$/i);
  if (m) return { base: m[1].trim(), size: m[2].trim(), form };
  return { base: n, size: "", form };
}

export function familyNameFor(name: string): string {
  const { base, form } = splitProductName(name);
  return form === "Vial" ? base : `${base} ${form}`;
}

export function slugifyFamily(name: string): string {
  return name
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function familySlugFor(name: string): string {
  return slugifyFamily(familyNameFor(name));
}

// Leading number in the size label, for ordering sizes small to large.
function sizeRank(size: string): number {
  const m = size.match(/(\d+(?:\.\d+)?)/);
  if (!m) return Number.POSITIVE_INFINITY;
  let v = parseFloat(m[1]);
  if (/mcg/i.test(size.split(/[x·]/)[0] || "")) v /= 1000;
  if (/\bIU\b/i.test(size)) v /= 1000;
  return v;
}

type FamilyInput = {
  name: string;
  slug: string;
  price: number | null;
  priceFrom: number | null;
  stockLevel: number;
  inStock: boolean;
  areas?: string[];
  category?: string;
};

export type ProductFamily<P extends FamilyInput> = {
  slug: string;
  name: string;
  base: string;
  form: ProductForm;
  // Sizes small to large.
  products: P[];
  // The product the tile links to and the size picker opens on: cheapest
  // purchasable size, else cheapest.
  primary: P;
  priceFrom: number | null;
  priceMax: number | null;
  // Every research area any size belongs to (for the category filter).
  areas: string[];
  // Highest stock across sizes ("Most Popular" sort uses stock as a proxy).
  stockLevel: number;
  inStock: boolean;
  sizes: string[];
};

function priceOf(p: FamilyInput): number {
  return p.priceFrom ?? p.price ?? Number.POSITIVE_INFINITY;
}

export function groupIntoFamilies<P extends FamilyInput>(products: P[]): ProductFamily<P>[] {
  const map = new Map<string, P[]>();
  for (const p of products) {
    const key = familySlugFor(p.name);
    const list = map.get(key);
    if (list) list.push(p);
    else map.set(key, [p]);
  }
  const out: ProductFamily<P>[] = [];
  for (const [slug, list] of map) {
    const sorted = [...list].sort(
      (a, b) => sizeRank(splitProductName(a.name).size) - sizeRank(splitProductName(b.name).size)
    );
    const purchasable = sorted.filter((p) => p.inStock && priceOf(p) !== Number.POSITIVE_INFINITY);
    const primary = [...(purchasable.length ? purchasable : sorted)].sort((a, b) => priceOf(a) - priceOf(b))[0];
    const prices = sorted.map(priceOf).filter((n) => n !== Number.POSITIVE_INFINITY);
    const { base, form } = splitProductName(sorted[0].name);
    const areas = Array.from(new Set(sorted.flatMap((p) => p.areas ?? (p.category ? [p.category] : []))));
    out.push({
      slug,
      name: familyNameFor(sorted[0].name),
      base,
      form,
      products: sorted,
      primary,
      priceFrom: prices.length ? Math.min(...prices) : null,
      priceMax: prices.length ? Math.max(...prices) : null,
      areas,
      stockLevel: Math.max(...sorted.map((p) => p.stockLevel ?? 0)),
      inStock: sorted.some((p) => p.inStock),
      sizes: sorted.map((p) => splitProductName(p.name).size).filter(Boolean),
    });
  }
  return out;
}

// Sizes of every product that shares a family with `product`, in size
// order, for the product page's size picker.
export function siblingsOf<P extends FamilyInput>(product: P, all: P[]): P[] {
  const key = familySlugFor(product.name);
  return groupIntoFamilies(all.filter((p) => familySlugFor(p.name) === key))[0]?.products ?? [product];
}
