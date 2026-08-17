import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllCategories,
  categorySlug,
  displayCategory,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Research Areas",
  description:
    "Browse research-grade compounds by research area: metabolic, endocrine, tissue and inflammation, cellular and longevity, immunology, neurological, and more.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">The Research Catalog</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">
        Research areas
      </h1>
      <p className="text-ink-soft mb-10 max-w-2xl leading-relaxed">
        Compounds grouped by the research area they are most commonly studied
        in. Each product page lists a lot-specific Certificate of Analysis
        reference and the CAS number for verification.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/categories/${categorySlug(category)}`}
            className="group block rounded-sm border border-line bg-white p-6 hover:border-gold-deep transition-colors"
          >
            <div className="font-serif-display text-lg text-ink group-hover:text-gold-deep transition-colors">
              {displayCategory(category)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
