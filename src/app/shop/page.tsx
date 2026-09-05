import type { Metadata } from "next";
import { getAllProducts, getAllCategories, filterVisible } from "@/lib/products";
import { hasGlp1Access } from "@/lib/current-session";
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

// 2026-09-05 (Josh, GLP-1 login gate): this page now checks the
// visitor's session (hasGlp1Access(), which reads cookies()) so GLP-1
// products can actually be dropped from the grid for anonymous
// visitors, not just hidden with CSS. That forces /shop to render
// per-request instead of being served from the static/ISR cache it used
// before - an accepted tradeoff so "not visible until you login" is
// real, not cosmetic. See SiteHeader.tsx for why the header's
// quick-search stays static instead of taking the same hit sitewide.
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [allProducts, categories, access] = await Promise.all([
    getAllProducts(),
    // 2026-08-30 (Josh): category browsing moved from a header nav
    // dropdown to a filter right here on the shop page - see
    // FilteredProductGrid.
    getAllCategories(),
    hasGlp1Access(),
  ]);
  const products = filterVisible(allProducts, access);

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Full Catalog</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">
        Shop Catalog
      </h1>
      <p className="text-ink-soft mb-10 max-w-2xl leading-relaxed">
        Research Grade Compounds. For laboratory research use only.
      </p>
      <FilteredProductGrid products={products} categories={categories} />
    </div>
  );
}
