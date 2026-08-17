"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

// Shared Add to Cart control. size="sm" is the compact version used on
// product cards (where the whole card is a link, so clicks must not
// navigate); size="lg" is the full-width version on product detail pages.
export default function AddToCartButton({
  productId,
  inStock,
  size = "sm",
}: {
  productId: string;
  inStock: boolean;
  size?: "sm" | "lg";
}) {
  const { addItem, adding } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const busy = adding === productId;

  const base =
    size === "lg"
      ? "inline-flex items-center justify-center rounded-full px-8 py-3.5 label-eyebrow text-[0.72rem] transition-colors"
      : "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 label-eyebrow text-[0.6rem] transition-colors";

  if (!inStock) {
    return (
      <span
        className={`${base} bg-cream-soft text-ink-soft/70 cursor-not-allowed`}
        aria-disabled
      >
        Out of Stock
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await addItem(productId);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1600);
      }}
      className={`${base} ${
        justAdded
          ? "bg-ink text-cream"
          : "bg-gold-deep text-cream hover:bg-ink"
      } disabled:opacity-60`}
    >
      {busy ? "Adding..." : justAdded ? "Added" : "Add to Cart"}
    </button>
  );
}
