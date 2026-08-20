import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { displayCategory } from "@/lib/catalog-shared";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Search Products",
  // Query-driven results pages are thin/duplicate content, so keep them
  // out of the index; the catalog and category pages are what should rank.
  robots: { index: false, follow: true },
};

function matches(query: string, haystacks: Array<string | undefined>) {
  const q = query.toLowerCase();
  return haystacks.some((h) => h?.toLowerCase().includes(q));
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  const products = await getAllProducts();
  const results = query
    ? products.filter((p) =>
        matches(query, [
          p.name,
          displayCategory(p.category),
          p.category,
          p.casNumber,
          p.description,
        ])
      )
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">
        {query ? (
          <>
            Search results for <span className="text-gold-deep">&quot;{query}&quot;</span>
          </>
        ) : (
          "Search"
        )}
      </h1>

      {query ? (
        <p className="text-ink-soft mb-10">
          {results.length} compound{results.length === 1 ? "" : "s"} found.
        </p>
      ) : (
        <p className="text-ink-soft mb-10">
          Use the search bar above to find a compound by name or research
          area, or browse the{" "}
          <Link href="/categories" className="underline hover:text-gold-deep transition-colors">
            full catalog
          </Link>
          .
        </p>
      )}

      {query && results.length === 0 && (
        <p className="text-ink-soft mb-12">
          No products match that search. Try a different term, or browse the{" "}
          <Link href="/categories" className="underline hover:text-gold-deep transition-colors">
            full catalog
          </Link>
          .
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {results.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
