"use client";

// Size picker on the product page (2026-09-06, Josh: pick BPC-157 on the
// shop grid, then choose the vial size here). Each size is still its own
// Swell product with its own page, so choosing one navigates to that
// product's URL: price, photo, stock, CAS, and the cart line item all
// stay exactly what Swell has for that SKU. Labelled "Size", which is
// what the competition uses for the mg picker.

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type SizeOption = {
  slug: string;
  size: string;
  price: number | null;
  inStock: boolean;
};

export default function SizePicker({ current, sizes }: { current: string; sizes: SizeOption[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  if (sizes.length < 2) return null;
  return (
    <div className="mb-6">
      <label className="label-eyebrow text-[0.62rem] text-ink-soft block mb-2">Size</label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const active = s.slug === current;
          return (
            <button
              key={s.slug}
              type="button"
              aria-pressed={active}
              disabled={pending}
              onClick={() => {
                if (!active) startTransition(() => router.push(`/products/${s.slug}`));
              }}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-gold-deep bg-gold-deep text-cream"
                  : "border-line bg-white text-ink hover:border-gold-deep"
              } ${!s.inStock ? "opacity-60" : ""} disabled:cursor-wait`}
            >
              {s.size}
              {s.price != null && (
                <span className={`ml-2 text-xs ${active ? "text-cream/80" : "text-ink-soft"}`}>
                  ${s.price.toFixed(2)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
