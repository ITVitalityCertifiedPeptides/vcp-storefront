"use client";

// Site-wide product search, live in the header on every page. Typing
// filters a lightweight in-memory index (name + category only, built
// server-side in SiteHeader) and shows up to 6 quick matches in a
// dropdown; Enter or "View all results" goes to the full /search page,
// which does a deeper match against the complete catalog.

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import VialIcon from "./VialIcon";

export type HeaderSearchProduct = {
  slug: string;
  name: string;
  category: string;
  price: number | null;
  image: string | null;
};

export default function HeaderSearch({
  products,
}: {
  products: HeaderSearchProduct[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [products, query]);

  function goToResults() {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div ref={containerRef} className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToResults();
        }}
      >
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft/60"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-28 sm:w-36 md:w-52 lg:w-64 rounded-full border border-line bg-white pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-gold-deep transition-[width] duration-150 focus:w-44 sm:focus:w-56 md:focus:w-64 lg:focus:w-72"
          />
        </div>
      </form>

      {open && query.trim() && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-line shadow-[0_12px_32px_-16px_rgba(21,19,15,0.35)] z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <ul>
                {results.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-soft transition-colors"
                    >
                      <div className="relative h-10 w-10 shrink-0 bg-black flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-contain"
                          />
                        ) : (
                          <VialIcon className="h-6 w-6 text-cream/30" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-ink truncate">{product.name}</p>
                        {product.price != null && (
                          <p className="text-xs text-ink-soft">
                            ${product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goToResults}
                className="block w-full text-center label-eyebrow text-[0.65rem] text-gold-deep hover:text-ink py-3 border-t border-line transition-colors"
              >
                View all results for &quot;{query.trim()}&quot;
              </button>
            </>
          ) : (
            <p className="px-4 py-4 text-sm text-ink-soft">
              No products found for &quot;{query.trim()}&quot;.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
