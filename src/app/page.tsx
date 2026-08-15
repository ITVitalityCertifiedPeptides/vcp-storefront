import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories, getAllProducts, categorySlug } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Research-Grade Compounds, RUO`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const categories = await getAllCategories();
  const products = await getAllProducts();

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">
          Research-grade peptides and compounds, backed by a Certificate of
          Analysis on every lot.
        </h1>
        <p className="mt-4 text-neutral-600 max-w-xl text-lg">
          {siteConfig.name} supplies laboratory research use only (RUO)
          compounds for qualified research settings. Every product is sold
          strictly for research use, not for human or veterinary consumption.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/categories"
            className="inline-flex items-center rounded-md bg-neutral-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-neutral-700"
          >
            Browse research categories
          </Link>
          <Link
            href="/coa"
            className="inline-flex items-center rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100"
          >
            Certificates of Analysis
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-200">
        <h2 className="text-xl font-semibold mb-6">Research categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const count = products.filter((p) => p.category === category).length;
            return (
              <Link
                key={category}
                href={`/categories/${categorySlug(category)}`}
                className="block rounded-lg border border-neutral-200 p-5 hover:border-neutral-400 transition-colors"
              >
                <div className="font-medium">{category}</div>
                <div className="text-sm text-neutral-500 mt-1">
                  {count} compound{count === 1 ? "" : "s"}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-neutral-200">
        <h2 className="text-xl font-semibold mb-4">
          Research transparency, not marketing claims
        </h2>
        <p className="text-neutral-600 max-w-2xl">
          Every product page on this site describes what a compound has been
          studied or researched for in the scientific literature. We do not
          make claims about effects on the human body, and we do not publish
          dosing guidance for human use. Our trust position is built on
          Certificate of Analysis documentation for every lot, not on
          promotional language.
        </p>
      </section>
    </div>
  );
}
