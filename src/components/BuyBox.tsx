"use client";

// Purchase panel for the product detail page: size/option selector (when
// the product has options in Swell), price, and Add to Cart.
// 2026-09-06 (Josh): Restock & Save / Autoship removed for good. The store
// is invoice-only, so there is no recurring billing and nothing to toggle.

import { useState } from "react";
import { useCart } from "./CartProvider";
import { getSwell } from "@/lib/swell-client";
import type { ProductOption } from "@/lib/products";

type BuyBoxProduct = {
  id: string;
  price: number | null;
  inStock: boolean;
  options: ProductOption[];
};

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function BuyBox({ product }: { product: BuyBoxProduct }) {
  const { refresh } = useCart();
  const [busy, setBusy] = useState(false);
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const option of product.options) {
      if (option.values[0]) initial[option.name] = option.values[0].name;
    }
    return initial;
  });
  const [justAdded, setJustAdded] = useState(false);
  // 2026-09-06 (Josh): quantity picker, since many buyers order several
  // vials of one size at a time.
  const [quantity, setQuantity] = useState(1);

  // Swell option value prices are additive on the base price.
  let unitPrice = product.price;
  if (unitPrice != null) {
    for (const option of product.options) {
      const chosen = option.values.find(
        (v) => v.name === selections[option.name]
      );
      if (chosen?.price) unitPrice += chosen.price;
    }
  }
  async function add() {
    setBusy(true);
    try {
      await getSwell().cart.addItem({
        product_id: product.id,
        quantity,
        ...(product.options.length > 0
          ? {
              options: Object.entries(selections).map(([name, value]) => ({
                name,
                value,
              })),
            }
          : {}),
      });
      await refresh();
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-8">
      {product.options.map((option) => (
        <div key={option.id} className="mb-4">
          <label className="label-eyebrow text-[0.62rem] text-ink-soft block mb-2">
            {option.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const active = selections[option.name] === value.name;
              return (
                <button
                  key={value.id}
                  type="button"
                  onClick={() =>
                    setSelections((s) => ({ ...s, [option.name]: value.name }))
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-gold-deep bg-gold-deep text-cream"
                      : "border-line bg-white text-ink hover:border-gold-deep"
                  }`}
                >
                  {value.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {unitPrice != null && (
        <p className="font-serif-display text-2xl text-ink mb-5">
          {money(unitPrice)}
          {quantity > 1 && (
            <span className="ml-3 text-sm font-sans text-ink-soft">
              {quantity} &times; = {money(unitPrice * quantity)}
            </span>
          )}
        </p>
      )}

      {product.inStock && (
        <div className="mb-5">
          <label className="label-eyebrow text-[0.62rem] text-ink-soft block mb-2">Quantity</label>
          <div className="inline-flex items-center rounded-full border border-line bg-white">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-10 w-10 text-lg text-ink hover:text-gold-deep disabled:opacity-40"
              disabled={quantity <= 1}
            >
              &minus;
            </button>
            <input
              type="number"
              min={1}
              max={99}
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
              aria-label="Quantity"
              className="w-12 text-center text-sm font-medium text-ink bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="h-10 w-10 text-lg text-ink hover:text-gold-deep"
            >
              +
            </button>
          </div>
        </div>
      )}

      {!product.inStock ? (
        <span
          className="inline-flex items-center justify-center rounded-full px-8 py-3.5 label-eyebrow text-[0.72rem] bg-cream-soft text-ink-soft/70 cursor-not-allowed"
          aria-disabled
        >
          Out of Stock
        </span>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={add}
          className={`inline-flex items-center justify-center rounded-full px-8 py-3.5 label-eyebrow text-[0.72rem] transition-colors ${
            justAdded ? "bg-ink text-cream" : "bg-gold-deep text-cream hover:bg-ink"
          } disabled:opacity-60`}
        >
          {justAdded ? "Added" : "Add to Cart"}
        </button>
      )}
      {/* 2026-08-29 (Josh): dropped the "Ships within 1 business day" claim
          here too - product.inStock isn't a reliable signal of which items
          actually ship that fast, so this was making a promise the data
          couldn't back up. The header banner's general "1-3 business days"
          range is the only shipping-time claim left on the site. */}
      {product.inStock && (
        <p className="text-xs text-ink-soft mt-3">
          In stock.
        </p>
      )}
    </div>
  );
}
