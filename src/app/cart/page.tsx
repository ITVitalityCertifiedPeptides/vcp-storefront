"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { getSwell, type SwellCart } from "@/lib/swell-client";
import { useCart } from "@/components/CartProvider";

// Flip to true once the Swell payment gateway is configured: buyers will
// then be sent to Swell's hosted payment checkout (cart.checkout_url)
// instead of the interim manual-payment checkout at /checkout.
const HOSTED_CHECKOUT = false;

function money(n?: number) {
  return typeof n === "number" ? `$${n.toFixed(2)}` : "";
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<SwellCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { refresh } = useCart();

  const load = useCallback(async () => {
    try {
      const result = (await getSwell().cart.get()) as unknown as SwellCart | null;
      setCart(result);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setQuantity(itemId: string, quantity: number) {
    setBusy(true);
    try {
      const swell = getSwell();
      const result = (quantity <= 0
        ? await swell.cart.removeItem(itemId)
        : await swell.cart.updateItem(itemId, {
            quantity,
          })) as unknown as SwellCart | null;
      setCart(result);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  function checkout() {
    if (HOSTED_CHECKOUT && cart?.checkout_url) {
      window.location.href = cart.checkout_url;
    } else {
      router.push("/checkout");
    }
  }

  const items = cart?.items || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-8">
        Your Cart
      </h1>

      {loading ? (
        <p className="text-ink-soft">Loading your cart...</p>
      ) : items.length === 0 ? (
        <div>
          <p className="text-ink-soft mb-6">Your cart is empty.</p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-full bg-gold-deep text-cream px-7 py-3.5 label-eyebrow text-[0.72rem] hover:bg-ink transition-colors"
          >
            Shop Peptides
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-line border-y border-line mb-8">
            {items.map((item) => (
              <li key={item.id} className="py-5 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium text-ink">
                    {item.product?.name || "Product"}
                  </p>
                  <p className="text-sm text-ink-soft mt-0.5">
                    {money(item.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    className="h-8 w-8 rounded-full border border-line flex items-center justify-center text-ink hover:border-gold-deep disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <span className="w-8 text-center font-medium text-ink">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 rounded-full border border-line flex items-center justify-center text-ink hover:border-gold-deep disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
                <p className="w-20 text-right font-semibold text-ink">
                  {money(item.price_total)}
                </p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setQuantity(item.id, 0)}
                  className="text-ink-soft hover:text-gold-deep disabled:opacity-50"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between mb-8">
            <p className="label-eyebrow text-[0.7rem] text-ink-soft">Subtotal</p>
            <p className="font-serif-display text-2xl text-ink">
              {money(cart?.sub_total ?? cart?.grand_total)}
            </p>
          </div>

          <button
            type="button"
            onClick={checkout}
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold-deep text-cream px-8 py-4 label-eyebrow text-[0.75rem] hover:bg-ink transition-colors disabled:opacity-60"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <p className="text-xs text-ink-soft mt-4 text-center">
            Free US shipping over $250, or over $75 on Scheduled Restock
            orders. No online payment right now: place your order and we
            contact you to arrange payment before it ships.
          </p>
        </>
      )}
    </div>
  );
}
