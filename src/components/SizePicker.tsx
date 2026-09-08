"use client";

// Form + Size pickers on the product page (2026-09-06, Josh). One shop
// tile per compound; here the buyer picks the form (Vial / Nasal Spray /
// Strips / ...) when more than one is sold on this storefront, then the
// size within that form. Each size is still its own Swell product with
// its own page, so choosing one navigates to that product's URL: price,
// photo, stock, CAS, and the cart line item all stay exactly what Swell
// has for that SKU. "Size" is what the competition calls the mg picker.

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export type SizeOption = {
  slug: string;
  size: string;
  form: string;
  price: number | null;
  inStock: boolean;
};

const pill = (active: boolean, dim: boolean) =>
  `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
    active ? "border-gold-deep bg-gold-deep text-cream" : "border-line bg-white text-ink hover:border-gold-deep"
  } ${dim ? "opacity-60" : ""} disabled:cursor-wait`;

export default function SizePicker({ current, sizes }: { current: string; sizes: SizeOption[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const me = sizes.find((s) => s.slug === current);
  if (!me || sizes.length < 2) return null;
  const forms = Array.from(new Set(sizes.map((s) => s.form)));
  const inForm = sizes.filter((s) => s.form === me.form);
  // scroll:false keeps the page where it is when switching size/form. The
  // default navigation scroll landed at the bottom of the page while the new
  // product page was still streaming in.
  const go = (slug: string) => {
    if (slug !== current) startTransition(() => router.push(`/products/${slug}`, { scroll: false }));
  };
  // Switching form lands on that form's cheapest in-stock size.
  const firstOf = (form: string) => {
    const list = sizes.filter((s) => s.form === form);
    const ok = list.filter((s) => s.inStock && s.price != null);
    return [...(ok.length ? ok : list)].sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9))[0];
  };
  return (
    <div className="mb-6">
      {forms.length > 1 && (
        <div className="mb-4">
          <label className="label-eyebrow text-[0.62rem] text-ink-soft block mb-2">Form</label>
          <div className="flex flex-wrap gap-2">
            {forms.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={f === me.form}
                disabled={pending}
                onClick={() => go(firstOf(f).slug)}
                className={pill(f === me.form, false)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}
      {inForm.length > 1 && (
        <div>
          <label className="label-eyebrow text-[0.62rem] text-ink-soft block mb-2">Size</label>
          <div className="flex flex-wrap gap-2">
            {inForm.map((s) => {
              const active = s.slug === current;
              return (
                <button
                  key={s.slug}
                  type="button"
                  aria-pressed={active}
                  disabled={pending}
                  onClick={() => go(s.slug)}
                  className={pill(active, false)}
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
      )}
    </div>
  );
}
