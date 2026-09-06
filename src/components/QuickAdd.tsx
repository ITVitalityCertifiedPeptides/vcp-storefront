"use client";

// Quick-add for product cards: one click adds a single unit to the cart.
// 2026-09-06 (Josh): the Restock & Save / Autoship chooser that used to
// open here is gone. The store is invoice-only with no recurring billing.

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function QuickAdd({
  productId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inStock: _inStock,
}: {
  productId: string;
  inStock: boolean;
}) {
  const { addItem, adding } = useCart();
  const [busy, setBusy] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const base =
    "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 label-eyebrow text-[0.6rem] transition-colors";

  // 2026-09-06 (Josh): no out-of-stock state anywhere. Anything not on
  // hand comes same-day from the local wholesaler, so every product is
  // always orderable; `inStock` is kept on the props so callers don't
  // change, but it is deliberately ignored here.

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
