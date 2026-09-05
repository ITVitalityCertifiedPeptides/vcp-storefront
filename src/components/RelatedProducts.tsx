import Link from "next/link";
import type { Product } from "@/lib/products";
import { categorySlug, displayCategory } from "@/lib/products";

// Cross-links a product page to others in the same category. This is the
// internal-linking structure the GTM doc's SEO plan calls "keyword-mapped
// content architecture" - it spreads authority across the catalog instead
// of leaving every product page as a dead end, and gives researchers an
// easy path to compare related compounds.
export default function RelatedProducts({
  current,
  products,
}: {
  current: Product;
  products: Product[];
}) {
  const related = products
    .filter((p) => p.category === current.category && p.slug !== current.slug)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 pb-16">
      <p className="label-eyebrow text-gold-deep mb-3">
        Related compounds
      </p>
      <h2 className="font-serif-display text-2xl text-ink mb-6">
        Also studied in {displayCategory(current.category)}
      </h2>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/products/${p.slug}`}
              className="block border border-line hover:border-gold-deep px-4 py-4 transition-colors"
            >
              <span className="font-medium text-ink text-sm block mb-1">
                {p.name}
              </span>
              <span className="text-xs text-ink-soft font-mono">
                CAS {p.casNumber || "N/A"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`/categories/${categorySlug(current.category)}`}
        className="inline-block mt-5 label-eyebrow text-[0.68rem] text-ink-soft hover:text-gold-deep transition-colors"
      >
        View all {displayCategory(current.category)} &rarr;
      </Link>
    </section>
  );
}
