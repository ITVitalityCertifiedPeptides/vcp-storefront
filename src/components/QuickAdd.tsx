"use client";

// Quick-add for product cards: one click adds a single unit to the cart.
// 2026-09-06 (Josh): the Restock & Save / Autoship chooser that used to
// open here is gone. The store is invoice-only with no recurring billing.

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function QuickAdd({
  productId,
  inStock,
}: {
  productId: string;
  inStock: boolean;
}) {
  const { addItem, adding } = useCart();
  const [busy, setBusy] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const base =
    "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 label-eyebrow text-[0.6rem] transition-colors";

  if (!inStock) {
    return (
      <span className={`${base} bg-cream-soft text-ink-soft/70 cursor-not-allowed`} aria-disabled>
        Out of Stock
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={busy || adding === productId}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setBusy(true);
        try {
          await addItem(productId);
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), 1600);
        } finally {
          setBusy(false);
        }
      }}
      className={`${base} ${
        justAdded ? "bg-ink text-cream" : "bg-gold-deep text-cream hover:bg-ink"
      } disabled:opacity-60`}
    >
      {busy || adding === productId ? "Adding..." : justAdded ? "Added" : "Add to Cart"}
    </button>
  );
}
