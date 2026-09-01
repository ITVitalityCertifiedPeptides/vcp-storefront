"use client";

// Product grid with filters: category and sort. Always shows the full
// product list Swell returns - see lib/products.ts's `inStock` comment
// for why: native backorder is on for the whole catalog now, so a
// product's stock count doesn't determine whether it can be bought, and
// it shouldn't determine whether it's shown either.
//
// 2026-08-30 (Josh): added the category and sort filters. Category
// browsing used to live as its own header nav item; Josh wants it as a
// filter here on the shop page instead, alongside a general "add filters
// like our competition has" ask. Matches the same product-to-category
// inclusion rule as /categories/[slug] (a product can appear under more
// than one research area - see getProductsByCategory in lib/products.ts)
// so filtering here and browsing a category page agree on what belongs.
//
// 2026-08-31 (Josh): pricing is public to every visitor now, so the price
// sort options that used to be gated behind an `approved` prop (login
// required) are on unconditionally.
//
// 2026-09-01 (Josh): removed the "In Stock" / "All Products" toggle
// entirely - with backorder live, filtering by stock level was hiding
// products that are genuinely available to order. The grid now always
// shows everything; only the Category and Sort selects remain.

import { useMemo, useState } from "react";
import type { Product } from "@/lib/catalog-shared";
import { displayCategory } from "@/lib/catalog-shared";
import ProductCard from "./ProductCard";

type SortOption = "featured" | "name_asc" | "name_desc" | "price_asc" | "price_desc";

export default function FilteredProductGrid({
  products,
  categories = [],
}: {
  products: Product[];
  // Optional: pass the live category list to show a "Category" filter.
  // Omitted (e.g. on the homepage's smaller featured grid), the select
  // just doesn't render - everything else behaves as before.
  categories?: string[];
}) {
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("featured");

  const shown = useMemo(() => {
    let list = products;
    if (category !== "all") {
      list = list.filter((p) => p.areas.includes(category));
    }
    list = [...list];
    switch (sort) {
      case "name_asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price_asc":
        list.sort(
          (a, b) =>
            (a.priceFrom ?? a.price ?? Number.POSITIVE_INFINITY) -
            (b.priceFrom ?? b.price ?? Number.POSITIVE_INFINITY)
        );
        break;
      case "price_desc":
        list.sort(
          (a, b) =>
            (b.priceFrom ?? b.price ?? Number.NEGATIVE_INFINITY) -
            (a.priceFrom ?? a.price ?? Number.NEGATIVE_INFINITY)
        );
        break;
      default:
        list.sort((a, b) => Number(b.inStock) - Number(a.inStock));
    }
    return list;
  }, [products, category, sort]);

  const selectClass =
    "rounded-full border border-line bg-white px-4 py-2 text-sm text-ink focus:outline-none focus:border-gold-deep cursor-pointer";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {categories.length > 0 && (
          <select
            className={selectClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {displayCategory(c)}
              </option>
            ))}
          </select>
        )}

        <select
          className={selectClass}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sort products"
        >
          <option value="featured">Sort: Featured</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {shown.length === 0 ? (
        <p className="text-ink-soft">No products match these filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
