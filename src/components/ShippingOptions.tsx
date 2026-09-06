"use client";

// Shipping method picker for checkout. Pulls the live services from Swell
// (Settings > Shipping: Standard $11.95 free over $250, Priority $16.95,
// Express $36.95 as of 2026-09-06), lets the customer pick one, and writes
// the choice onto the cart so Swell's shipment_total / grand_total reflect
// it before the order is placed.
//
// The service NAME matters downstream: ShipStation's automation rules
// match on it ("standard" -> Ground Advantage, "priority" -> Priority
// Mail, "express" -> Priority Mail Express). Rename services in Swell and
// those rules need updating too.
//
// If Swell can't return rates (no address on the cart yet, network blip)
// we fall back to a static copy of the same three services so checkout
// never dead-ends; the order still carries the chosen service id and
// Swell recalculates the real charge on submit.

import { useEffect, useRef, useState } from "react";
import { getSwell, type SwellCart } from "@/lib/swell-client";

export type ShippingRate = {
  id: string;
  name: string;
  description?: string;
  price: number;
};

const FALLBACK = (subTotal: number): ShippingRate[] => [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "USPS Ground Advantage, typically 2 to 5 business days. Free on orders over $250.",
    price: subTotal > 250 ? 0 : 11.95,
  },
  {
    id: "priority",
    name: "Priority Shipping",
    description: "USPS Priority Mail, typically 1 to 3 business days.",
    price: 16.95,
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "USPS Priority Mail Express, overnight to 2 business days.",
    price: 36.95,
  },
];

function money(n: number) {
  return n === 0 ? "Free" : `$${n.toFixed(2)}`;
}

type Props = {
  // The cart is loaded; safe to talk to Swell.
  ready: boolean;
  subTotal: number;
  // Currently selected service id (parent owns it so placeOrder can read it).
  value: string;
  // Fires with the chosen rate and the refreshed cart (so totals update).
  onChange: (rate: ShippingRate, cart: SwellCart | null) => void;
  className?: string;
};

export default function ShippingOptions({ ready, subTotal, value, onChange, className }: Props) {
  const [rates, setRates] = useState<ShippingRate[] | null>(null);
  const [busy, setBusy] = useState(false);
  const loadedFor = useRef<number | null>(null);

  // Load rates once the cart is ready, and again if the subtotal crosses
  // a threshold (the free-over-$250 rule changes Standard's price).
  useEffect(() => {
    if (!ready) return;
    if (loadedFor.current === subTotal) return;
    loadedFor.current = subTotal;
    let cancelled = false;
    (async () => {
      let list: ShippingRate[] | null = null;
      try {
        const swell = getSwell();
        // Rates are zone-based; the only zone is the US, so a country is
        // enough for Swell to return the list before the address is typed.
        try {
          await swell.cart.update({ shipping: { country: "US" } });
        } catch {
          /* cart may already carry a country; not fatal */
        }
        const res = (await swell.cart.getShippingRates()) as unknown as {
          services?: Array<{ id: string; name: string; description?: string; price?: number }>;
        } | null;
        const services = res?.services ?? [];
        if (services.length) {
          list = services
            .map((s) => ({
              id: s.id,
              name: s.name,
              description: s.description,
              price: typeof s.price === "number" ? s.price : 0,
            }))
            .sort((a, b) => a.price - b.price);
        }
      } catch (err) {
        console.warn("Shipping rates unavailable, using fallback list:", err);
      }
      if (cancelled) return;
      const final = list ?? FALLBACK(subTotal);
      setRates(final);
      // Keep the parent's selection valid; default to the cheapest option.
      const current = final.find((r) => r.id === value);
      if (!current) {
        void select(final[0]);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, subTotal]);

  async function select(rate: ShippingRate) {
    setBusy(true);
    let cart: SwellCart | null = null;
    try {
      const swell = getSwell();
      cart = (await swell.cart.update({ shipping: { service: rate.id } })) as unknown as SwellCart | null;
    } catch (err) {
      console.warn("Could not set shipping service on cart:", err);
    } finally {
      setBusy(false);
    }
    onChange(rate, cart);
  }

  if (!ready) return null;

  return (
    <div className={className}>
      <p className="label-eyebrow text-[0.7rem] text-gold-deep mb-3">Shipping Method</p>
      <div className="border border-line rounded-sm divide-y divide-line mb-8">
        {(rates ?? FALLBACK(subTotal)).map((rate) => {
          const checked = rate.id === value;
          return (
            <label
              key={rate.id}
              className={`flex items-start gap-3 p-4 cursor-pointer ${checked ? "bg-cream-soft/60" : ""} ${busy ? "opacity-70" : ""}`}
            >
              <input
                type="radio"
                name="shipping-service"
                className="mt-1 accent-gold-deep"
                checked={checked}
                disabled={busy}
                onChange={() => select(rate)}
              />
              <span className="flex-1 min-w-0">
                <span className="flex justify-between gap-3">
                  <span className="text-sm font-medium text-ink">{rate.name}</span>
                  <span className="text-sm font-medium text-ink whitespace-nowrap">{money(rate.price)}</span>
                </span>
                {rate.description && (
                  <span className="block text-xs text-ink-soft mt-1 leading-relaxed">{rate.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
