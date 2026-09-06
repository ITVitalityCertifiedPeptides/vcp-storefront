"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

// Shared Add to Cart control. size="sm" is the compact version used on
// product cards (where the whole card is a link, so clicks must not
// navigate); size="lg" is the full-width version on product detail pages.
export default function AddToCartButton({
  productId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inStock: _inStock,
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

  // 2026-09-06 (Josh): no out-of-stock state anywhere. Anything not on
  // hand comes same-day from the local wholesaler, so every product is
  // always orderable; `inStock` is kept on the props so callers don't
  // change, but it is deliberately ignored here.

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
