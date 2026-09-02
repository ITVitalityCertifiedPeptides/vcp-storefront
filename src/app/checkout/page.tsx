"use client";

// Invoice-based checkout: collects contact + shipping details and submits
// the order to Swell as UNPAID (pending payment). Our team then sends the
// buyer an invoice (Zelle / Venmo / Apple Cash / PayPal) and the order ships
// once payment is confirmed. Pay by Invoice is the only payment method: the
// Card and crypto "Coming Soon" options have been removed. Everything is at
// the SAME listed price (no payment-method discounts anywhere in this flow).

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSwell, type SwellCart } from "@/lib/swell-client";
import { useCart } from "@/components/CartProvider";
import { trackConversion } from "@/lib/tapfiliate";
import { isRestrictedState } from "@/lib/restricted-states";

function money(n?: number) {
  return typeof n === "number" ? `$${n.toFixed(2)}` : "";
}

export default function CheckoutPage() {
  const router = useRouter();
  const { refresh } = useCart();
  const [cart, setCart] = useState<SwellCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [asGuest, setAsGuest] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    attested: false,
  });

  const load = useCallback(async () => {
    try {
      const swell = getSwell();
      const result = (await swell.cart.get()) as unknown as SwellCart | null;
      setCart(result);
      // Pre-fill contact + shipping from the signed-in account's saved
      // shipping details (managed on /account).
      try {
        const account = (await swell.account.get()) as unknown as {
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          shipping?: {
            name?: string;
            address1?: string;
            address2?: string;
            city?: string;
            state?: string;
            zip?: string;
            phone?: string;
          };
        } | null;
        if (account?.email) {
          setSignedIn(true);
          const ship = account.shipping;
          setForm((f) => ({
            ...f,
            firstName: f.firstName || account.first_name || "",
            lastName: f.lastName || account.last_name || "",
            email: f.email || account.email || "",
            phone: f.phone || ship?.phone || account.phone || "",
            address1: f.address1 || ship?.address1 || "",
            address2: f.address2 || ship?.address2 || "",
            city: f.city || ship?.city || "",
            state: f.state || ship?.state || "",
            zip: f.zip || ship?.zip || "",
          }));
        }
      } catch {
        // Not signed in; leave the form empty.
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.attested) {
      setError(
        "Please confirm the research use only statement to place your order."
      );
      return;
    }
    // State shipping restrictions: matches the list published on
    // /ruo-policy (lib/restricted-states.ts is the single source of
    // truth for both).
    const restricted = isRestrictedState(form.state);
    if (restricted) {
      setError(
        `We're sorry, but we do not sell or ship to ${restricted.name}. ` +
          "See our Research Use Only Policy for the current list of " +
          "restricted states."
      );
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const swell = getSwell();
      const name = `${form.firstName} ${form.lastName}`.trim();
      const base = {
        shipping: {
          name,
          address1: form.address1,
          address2: form.address2 || undefined,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: "US",
          phone: form.phone,
          // Swell also won't submit an order without a shipping SERVICE
          // selected (separate requirement from the billing method below) —
          // "standard" is the id of "Standard Shipping", the only shipping
          // service enabled in Settings > Shipping. Confirmed via
          // swell.cart.getShippingRates() on 2026-08-20, which returned
          // exactly one service: { id: "standard", name: "Standard
          // Shipping" }. Without this, submitOrder fails with "Please
          // select a shipping service."
          service: "standard",
        },
        // Swell won't submit an order without a billing block + a
        // billing.method that matches a payment method configured in
        // Settings > Payments. We collect one address (no separate billing
        // form), so billing mirrors shipping, with method set to the
        // "Pay by Invoice" manual payment method (id "cash" in Swell,
        // enabled 2026-08-20 — was previously disabled, which is why
        // submitOrder failed with "Billing information is incomplete").
        billing: {
          name,
          address1: form.address1,
          address2: form.address2 || undefined,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: "US",
          phone: form.phone,
          method: "cash",
        },
        comments:
          "RUO attestation accepted at checkout. Invoice-based payment: send the buyer an invoice (Zelle / Venmo / Apple Cash / PayPal). Ship only after payment is confirmed.",
        metadata: {
          ruo_attestation: true,
          ruo_attested_at: new Date().toISOString(),
          payment_method: "invoice",
          invoice_pending: true,
        },
      };
      // Swell's public API rejects account name/phone updates through the
      // cart whenever the cart is already tied to an existing account
      // record (signed-in sessions, or a guest cart whose email matches a
      // registered account) with "You are not allowed to update
      // `account.first_name`". So: try the richest payload first for new
      // guests, and on a permission error fall back to email-only, then to
      // no account block at all (an attached cart already has its email).
      // The buyer's name still reaches the order via shipping.name.
      const attempts: Array<Record<string, unknown>> = signedIn
        ? [base, { ...base, account: { email: form.email } }]
        : [
            {
              ...base,
              account: {
                email: form.email,
                first_name: form.firstName,
                last_name: form.lastName,
                phone: form.phone,
              },
            },
            { ...base, account: { email: form.email } },
            base,
          ];
      let updated = false;
      let lastErr: unknown = null;
      for (const payload of attempts) {
        try {
          await swell.cart.update(payload);
          updated = true;
          break;
        } catch (err) {
          lastErr = err;
          const msg = String(
            (err as { message?: string })?.message ?? err
          ).toLowerCase();
          // Only a permission complaint about the account block should
          // trigger a retry; anything else is a real failure.
          if (!msg.includes("not allowed")) throw err;
        }
      }
      if (!updated) throw lastErr;
      const order = (await swell.cart.submitOrder()) as unknown as {
        number?: string | number;
        id?: string;
        sub_total?: number;
        grand_total?: number;
      } | null;
      // Report the referral conversion to Tapfiliate: order number,
      // product subtotal (commission excludes shipping/tax), and the
      // buyer's email as customer_id for lifetime/recurring attribution.
      const number = order?.number ? String(order.number) : "";
      const total = order?.grand_total ?? cart?.grand_total ?? cart?.sub_total ?? 0;
      trackConversion(
        number || order?.id || "",
        order?.sub_total ?? cart?.sub_total ?? 0,
        form.email
      );
      await refresh();
      const params = new URLSearchParams();
      if (number) params.set("number", number);
      if (total) params.set("total", total.toFixed(2));
      const qs = params.toString();
      router.push(`/order-confirmed${qs ? `?${qs}` : ""}`);
    } catch (err) {
      // Keep the user-facing message friendly, but log the real reason so
      // it shows in the browser console for debugging.
      console.error("Checkout failed:", err);
      setError(
        "We couldn't place the order. Please try again, or email us and we'll take your order directly."
      );
      setSubmitting(false);
    }
  }

  const items = cart?.items || [];
  const inputClass =
    "w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-gold-deep";

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">
        Checkout
      </h1>
      <p className="text-ink-soft leading-relaxed mb-10">
        Checkout is invoice-based. Place your order and our team sends
        your invoice with payment instructions. Nothing is charged online.
      </p>

      {loading ? (
        <p className="text-ink-soft">Loading...</p>
      ) : items.length === 0 ? (
        <div>
          <p className="text-ink-soft mb-6">Your cart is empty.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-gold-deep text-cream px-7 py-3.5 label-eyebrow text-[0.72rem] hover:bg-ink transition-colors"
          >
            Shop Peptides
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      ) : !signedIn && !asGuest ? (
        <div>
          <p className="label-eyebrow text-[0.7rem] text-gold-deep mb-4">
            How would you like to check out?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Link
              href="/account?return=/checkout"
              className="rounded-sm border border-gold-deep/50 bg-white px-5 py-5 hover:border-gold-deep transition-colors block"
            >
              <p className="font-medium text-ink mb-1.5">
                Sign in or create an account
              </p>
              <p className="text-sm text-ink-soft leading-relaxed">
                Track your orders, reuse saved shipping details, and manage
                Restock autoship in one place.
              </p>
            </Link>
            <button
              type="button"
              onClick={() => setAsGuest(true)}
              className="rounded-sm border border-line bg-white px-5 py-5 hover:border-gold-deep transition-colors text-left"
            >
              <p className="font-medium text-ink mb-1.5">Continue as guest</p>
              <p className="text-sm text-ink-soft leading-relaxed">
                No account needed. You can always create one later with the
                same email to see this order.
              </p>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="mb-8 border-y border-line divide-y divide-line">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex justify-between text-sm">
                <span className="text-ink">
                  {item.product?.name || "Product"}{" "}
                  <span className="text-ink-soft">x{item.quantity}</span>
                </span>
                <span className="font-medium text-ink">
                  {money(item.price_total)}
                </span>
              </div>
            ))}
            <div className="py-3 flex justify-between">
              <span className="label-eyebrow text-[0.68rem] text-ink-soft">
                Subtotal (before shipping)
              </span>
              <span className="font-serif-display text-lg text-ink">
                {money(cart?.sub_total ?? cart?.grand_total)}
              </span>
            </div>
          </div>

          <p className="label-eyebrow text-[0.7rem] text-gold-deep mb-3">
            Payment Method
          </p>
          <div className="border border-line rounded-sm mb-8">
            <div className="p-4 bg-cream-soft/60">
              <span className="block text-sm font-medium text-ink">
                Pay by Invoice
              </span>
              <span className="block text-xs text-ink-soft mt-1 leading-relaxed">
                Place your order now. We send your invoice with payment
                instructions for Zelle, Venmo, Apple Cash, or PayPal. Your
                order ships once payment is confirmed.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              className={inputClass}
              placeholder="First name"
              required
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Last name"
              required
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
            />
            <input
              className={inputClass}
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            <input
              className={inputClass}
              type="tel"
              placeholder="Phone"
              required
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <input
              className={inputClass}
              placeholder="Street address"
              required
              value={form.address1}
              onChange={(e) => set("address1", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="Apt, suite, etc. (optional)"
              value={form.address2}
              onChange={(e) => set("address2", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <input
              className={inputClass}
              placeholder="City"
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="State"
              required
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="ZIP"
              required
              value={form.zip}
              onChange={(e) => set("zip", e.target.value)}
            />
          </div>

          <label className="flex items-start gap-3 mb-8 cursor-pointer">
            <input
              type="checkbox"
              checked={form.attested}
              onChange={(e) => set("attested", e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#a67c24]"
            />
            <span className="text-sm text-ink-soft leading-relaxed">
              I confirm that I am 21 or older, that all products in this
              order are for laboratory research use only, and that they
              will not be used for human or veterinary purposes.
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-700 mb-6" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold-deep text-cream px-8 py-4 label-eyebrow text-[0.75rem] hover:bg-ink transition-colors disabled:opacity-60"
          >
            {submitting ? "Placing Order..." : "Complete Order"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <p className="text-xs text-ink-soft mt-4 text-center">
            Nothing is charged online. Your invoice with payment
            instructions follows by email.
          </p>
        </form>
      )}
    </div>
  );
}
