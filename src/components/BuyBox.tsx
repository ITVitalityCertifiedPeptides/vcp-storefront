"use client";

// Purchase panel for the product detail page: size/option selector (when
// the product has options in Swell), a One-time vs Restock & Save toggle
// (when subscription plans are configured in Swell), and Add to Cart.
// Everything is data-driven: products without options or plans render a
// plain price + Add to Cart, and the extra controls appear automatically
// once the catalog is configured.

import { useState } from "react";
import { useCart } from "./CartProvider";
import { getSwell } from "@/lib/swell-client";
import type { ProductOption, SubscriptionPlan } from "@/lib/products";

// Keep in sync with the recurring discount configured on the Swell
// subscription plans. This constant only drives the DISPLAYED savings
// label and estimate; the authoritative price always comes from Swell at
// cart/checkout time.
const RESTOCK_DISCOUNT = 0.1;

type BuyBoxProduct = {
  id: string;
  price: number | null;
  inStock: boolean;
  options: ProductOption[];
  subscription: SubscriptionPlan[] | null;
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
  const [purchaseType, setPurchaseType] = useState<"standard" | "subscription">(
    "standard"
  );
  const [planId, setPlanId] = useState(product.subscription?.[0]?.id || "");
  const [justAdded, setJustAdded] = useState(false);

  const hasRestock = (product.subscription?.length || 0) > 0;

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
  const restockPrice =
    unitPrice != null ? unitPrice * (1 - RESTOCK_DISCOUNT) : null;

  async function add() {
    setBusy(true);
    try {
      await getSwell().cart.addItem({
        product_id: product.id,
        quantity: 1,
        ...(product.options.length > 0
          ? {
              options: Object.entries(selections).map(([name, value]) => ({
                name,
                value,
              })),
            }
          : {}),
        ...(purchaseType === "subscription" && planId
          ? { purchase_option: { type: "subscription", plan_id: planId } }
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

      {hasRestock && unitPrice != null ? (
        <div className="border border-line rounded-sm divide-y divide-line mb-5">
          <label className="flex items-center justify-between gap-3 p-4 cursor-pointer">
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="purchase-type"
                checked={purchaseType === "standard"}
                onChange={() => setPurchaseType("standard")}
                className="h-4 w-4 accent-[#a67c24]"
              />
              <span className="text-sm font-medium text-ink">
                One-time purchase
              </span>
            </span>
            <span className="font-semibold text-ink">{money(unitPrice)}</span>
          </label>
          <div className="p-4">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="purchase-type"
                  checked={purchaseType === "subscription"}
                  onChange={() => setPurchaseType("subscription")}
                  className="h-4 w-4 accent-[#a67c24]"
                />
                <span className="text-sm font-medium text-ink">
                  Restock &amp; Save{" "}
                  <span className="text-gold-deep">
                    {Math.round(RESTOCK_DISCOUNT * 100)}%
                  </span>{" "}
                  with Autoship
                </span>
              </span>
              <span className="font-semibold text-ink">
                {restockPrice != null ? money(restockPrice) : ""}
              </span>
            </label>
            {purchaseType === "subscription" && (
              <div className="mt-3 pl-7">
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  className="rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-gold-deep"
                >
                  {(product.subscription || []).map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-ink-soft mt-2">
                  Cancel or change frequency anytime. Free US shipping on
                  Restock orders over $75.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        unitPrice != null && (
          <p className="font-serif-display text-2xl text-ink mb-5">
            {money(unitPrice)}
          </p>
        )
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
    </div>
  );
}
