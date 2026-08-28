"use client";

// Product grid with a stock filter. Defaults to showing in-stock products
// only, with one click to see the full list.

import { useState } from "react";
import type { Product } from "@/lib/catalog-shared";
import ProductCard from "./ProductCard";

export default function FilteredProductGrid({
  products,
  approved = false,
}: {
  products: Product[];
  approved?: boolean;
}) {
  const [filter, setFilter] = useState<"in_stock" | "all">("in_stock");

  const inStockCount = products.filter((p) => p.inStock).length;
  const shown = [...products]
    .sort((a, b) => Number(b.inStock) - Number(a.inStock))
    .filter((p) => (filter === "in_stock" ? p.inStock : true));

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-gold-deep bg-gold-deep text-cream"
        : "border-line bg-white text-ink hover:border-gold-deep"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          type="button"
          className={chip(filter === "in_stock")}
          onClick={() => setFilter("in_stock")}
        >
          In Stock
        </button>
        <button
          type="button"
          className={chip(filter === "all")}
          onClick={() => setFilter("all")}
        >
          All Products
        </button>
      </div>

      {shown.length === 0 ? (
        <p className="text-ink-soft">
          {inStockCount === 0
            ? "Nothing in stock in this view right now. Switch to All Products to browse the full list."
            : "No products match this filter."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map((product) => (
            <ProductCard key={product.slug} product={product} approved={approved} />
          ))}
        </div>
      )}
    </div>
  );
}
