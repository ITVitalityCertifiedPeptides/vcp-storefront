"use client";

// Quick-add for product cards. Products with Restock plans open a small
// chooser (one-time vs Restock & Save with Autoship) so the autoship
// discount is offered at the moment of adding, not only on the product
// page. Products without plans add directly, same as before.
//
// The dialog renders through a portal to document.body because the whole
// product card is an anchor; rendering inside it would make every click
// in the dialog navigate.

import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useCart } from "./CartProvider";
import { getSwell } from "@/lib/swell-client";
import type { SubscriptionPlan } from "@/lib/catalog-shared";

// Display-only; authoritative prices come from Swell at cart time.
const RESTOCK_DISCOUNT = 0.1;

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function QuickAdd({
  productId,
  name,
  price,
  inStock,
  plans,
}: {
  productId: string;
  name: string;
  price: number | null;
  inStock: boolean;
  plans: SubscriptionPlan[] | null;
}) {
  const { addItem, refresh, adding } = useCart();
  const [open, setOpen] = useState(false);
  const [planId, setPlanId] = useState(plans?.[0]?.id || "");
  const [busy, setBusy] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const hasPlans = (plans?.length || 0) > 0 && price != null;
  const base =
    "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 label-eyebrow text-[0.6rem] transition-colors";

  if (!inStock) {
    return (
      <span className={`${base} bg-cream-soft text-ink-soft/70 cursor-not-allowed`} aria-disabled>
        Out of Stock
      </span>
    );
  }

  async function addOneTime() {
    setBusy(true);
    try {
      await addItem(productId);
      finish();
    } finally {
      setBusy(false);
    }
  }

  async function addRestock() {
    setBusy(true);
    try {
      await getSwell().cart.addItem({
        product_id: productId,
        quantity: 1,
        purchase_option: { type: "subscription", plan_id: planId },
      });
      await refresh();
      finish();
    } finally {
      setBusy(false);
    }
  }

  function finish() {
    setOpen(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <>
      <button
        type="button"
        disabled={busy || adding === productId}
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (hasPlans) {
            setOpen(true);
          } else {
            await addOneTime();
          }
        }}
        className={`${base} ${
          justAdded ? "bg-ink text-cream" : "bg-gold-deep text-cream hover:bg-ink"
        } disabled:opacity-60`}
      >
        {busy || adding === productId
          ? "Adding..."
          : justAdded
            ? "Added"
            : "Add to Cart"}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Add ${name} to cart`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div className="max-w-sm w-full bg-cream rounded-sm border border-line p-6 relative">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-3.5 right-3.5 text-ink-soft hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
              <p className="font-medium text-ink pr-6 mb-5">{name}</p>

              <button
                type="button"
                disabled={busy}
                onClick={addOneTime}
                className="w-full flex items-center justify-between rounded-sm border border-line bg-white px-4 py-3.5 mb-3 hover:border-gold-deep transition-colors disabled:opacity-60"
              >
                <span className="text-sm font-medium text-ink">
                  One-time purchase
                </span>
                <span className="font-semibold text-ink">
                  {price != null ? money(price) : ""}
                </span>
              </button>

              <div className="rounded-sm border border-gold-deep/50 bg-white px-4 py-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-ink">
                    Restock &amp; Save{" "}
                    <span className="text-gold-deep">10%</span> with Autoship
                  </span>
                  <span className="font-semibold text-ink">
                    {price != null ? money(price * (1 - RESTOCK_DISCOUNT)) : ""}
                  </span>
                </div>
                <p className="text-[0.7rem] text-ink-soft mb-3">
                  Cancel or change frequency anytime.
                </p>
                <div className="flex items-center gap-2.5">
                  <select
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    className="flex-1 rounded-sm border border-line bg-white px-2.5 py-2 text-sm text-ink focus:outline-none focus:border-gold-deep"
                  >
                    {(plans || []).map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={addRestock}
                    className="rounded-full bg-gold-deep text-cream px-4 py-2 label-eyebrow text-[0.6rem] hover:bg-ink transition-colors disabled:opacity-60"
                  >
                    {busy ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
