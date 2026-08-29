import type { Metadata } from "next";
import { getAllProducts, filterVisible } from "@/lib/products";
import { isApprovedResearcher } from "@/lib/current-session";
import FilteredProductGrid from "@/components/FilteredProductGrid";

// Traditional shopping catalog (2026-08-29, Josh): the "Shop Catalog" nav
// button used to send everyone to /categories - pick a research area
// first, THEN see products. Josh's direction: "take out that entire thing
// where you select the deal and just go right into the shopping" - so
// this page is the new destination for every primary "shop" entry point
// (header button, homepage hero) and just shows the full catalog directly,
// same grid/filter component (FilteredProductGrid, in-stock vs. all) the
// homepage already uses for its "Shop peptides" section.
//
// /categories and /categories/[slug] are left in place, unchanged - still
// linked from the footer and the homepage's "Shop by research area"
// section as a secondary way to browse, still indexed for SEO - they're
// just no longer the primary/forced path into the catalog.
export const metadata: Metadata = {
  title: "Shop Catalog",
  description:
    "Browse the full research-grade peptide and compound catalog. Every lot ships with a Certificate of Analysis. For laboratory research use only.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const approved = await isApprovedResearcher();
  const products = filterVisible(await getAllProducts(), approved);

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Full Catalog</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">
        Shop Catalog
      </h1>
      <p className="text-ink-soft mb-10 max-w-2xl leading-relaxed">
        {products.length} research-grade compound{products.length === 1 ? "" : "s"},
        every lot backed by a Certificate of Analysis. For laboratory
        research use only.
      </p>
      <FilteredProductGrid products={products} approved={approved} />
    </div>
  );
}
