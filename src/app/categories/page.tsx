import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories, getAllProducts, categorySlug } from "@/lib/products";

export const metadata: Metadata = {
  title: "Research Categories",
  description:
    "Browse research-grade compounds by category: metabolic, growth hormone, tissue repair, cellular longevity, immune, nootropic, and more.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const categories = getAllCategories();
  const products = getAllProducts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-2">Research categories</h1>
      <p className="text-neutral-600 mb-8 max-w-2xl">
        Compounds grouped by the research area they are most commonly studied
        in. Each product page lists a lot-specific Certificate of Analysis
        reference and the CAS number for verification.
      </p>
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
    </div>
  );
}
