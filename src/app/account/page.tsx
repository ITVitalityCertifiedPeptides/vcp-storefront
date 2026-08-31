"use client";

// Customer account area: sign in / registration / password recovery,
// order history with items and tracking, saved shipping details (used to
// pre-fill checkout), and Restock autoship subscriptions (read-only view;
// changes go through support so cancellations are handled by the team).

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, MapPin, RefreshCw, ChevronDown } from "lucide-react";
import { getSwell } from "@/lib/swell-client";

type Account = {
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

type OrderItem = {
  id?: string;
  quantity?: number;
  price_total?: number;
  product?: { name?: string };
};

type Shipment = {
  carrier?: string;
  tracking_code?: string;
};

type Order = {
  id: string;
  number?: string | number;
  date_created?: string;
  grand_total?: number;
  status?: string;
  paid?: boolean;
  delivered?: boolean;
  items?: OrderItem[];
  shipments?: { results?: Shipment[] };
};

type Subscription = {
  id: string;
  status?: string;
  interval?: string;
  interval_count?: number;
  date_order_period_end?: string;
  product?: { name?: string };
  recurring_total?: number;
};

function money(n?: number) {
  return typeof n === "number" ? `$${n.toFixed(2)}` : "";
}

function orderStatusLabel(order: Order): string {
  if (order.delivered) return "Shipped";
  if (order.paid) return "Paid, preparing shipment";
  if (order.status === "canceled") return "Canceled";
  return "Awaiting payment";
}

function trackingUrl(shipment: Shipment): string | null {
  const code = shipment.tracking_code;
  if (!code) return null;
  const carrier = (shipment.carrier || "").toLowerCase();
  if (carrier.includes("ups")) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(code)}`;
  }
  return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(code)}`;
}

function AccountContent() {
  const router = useRouter();
  const params = useSearchParams();
  // Only allow same-site relative paths as a return target.
  const rawReturn = params.get("return") || "";
  const returnTo =
    rawReturn.startsWith("/") && !rawReturn.startsWith("//") ? rawReturn : "";

  const [account, setAccount] = useState<Account>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"signin" | "create" | "forgot">("signin");
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [shippingForm, setShippingForm] = useState({
    name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [busy, setBusy] = useState(false);
  const [shippingBusy, setShippingBusy] = useState(false);
  const [shippingSaved, setShippingSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-gold-deep";

  const hydrateShippingForm = useCallback((acct: Account) => {
    const s = acct?.shipping;
    setShippingForm({
      name:
        s?.name ||
        [acct?.first_name, acct?.last_name].filter(Boolean).join(" "),
      address1: s?.address1 || "",
      address2: s?.address2 || "",
      city: s?.city || "",
      state: s?.state || "",
      zip: s?.zip || "",
      phone: s?.phone || acct?.phone || "",
    });
  }, []);

  const loadAccountData = useCallback(async () => {
    const swell = getSwell();
    try {
      const result = (await swell.account.listOrders({
        limit: 25,
        expand: ["items.product", "shipments"],
      } as never)) as unknown as { results?: Order[] } | null;
      setOrders(result?.results || []);
    } catch {
      setOrders([]);
    }
    try {
      const subs = (await (
        swell as unknown as {
          subscriptions: { list: () => Promise<{ results?: Subscription[] }> };
        }
      ).subscriptions.list()) as { results?: Subscription[] } | null;
      setSubscriptions(subs?.results || []);
    } catch {
      setSubscriptions([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const current = (await getSwell().account.get()) as unknown as Account;
        if (cancelled) return;
        if (current?.email) {
          setAccount(current);
          hydrateShippingForm(current);
          await loadAccountData();
        } else {
          setAccount(null);
        }
      } catch {
        if (!cancelled) setAccount(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAccountData, hydrateShippingForm]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setShip<K extends keyof typeof shippingForm>(key: K, value: string) {
    setShippingSaved(false);
    setShippingForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const swell = getSwell();
      if (mode === "forgot") {
        await swell.account.recover({
          email: form.email,
          reset_url: `${window.location.origin}/account/reset?key={reset_key}`,
        });
        setNotice(
          "If an account exists for that email, a password reset link is on its way."
        );
        setMode("signin");
        return;
      }
      if (mode === "create") {
        await swell.account.create({
          email: form.email,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
        });
      }
      const logged = (await swell.account.login(
        form.email,
        form.password
      )) as unknown as Account;
      if (!logged?.email) {
        setError(
          mode === "signin"
            ? "Invalid email or password."
            : "Could not create the account. It may already exist, try signing in."
        );
      } else if (returnTo) {
        router.push(returnTo);
        return;
      } else {
        setAccount(logged);
        hydrateShippingForm(logged);
        await loadAccountData();
      }
    } catch {
      setError(
        mode === "signin"
          ? "Invalid email or password."
          : mode === "forgot"
            ? "Could not send the reset email. Please try again."
            : "Could not create the account. It may already exist, try signing in."
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveShipping(e: React.FormEvent) {
    e.preventDefault();
    setShippingBusy(true);
    setError(null);
    try {
      const updated = (await getSwell().account.update({
        shipping: {
          name: shippingForm.name,
          address1: shippingForm.address1,
          address2: shippingForm.address2 || undefined,
          city: shippingForm.city,
          state: shippingForm.state,
          zip: shippingForm.zip,
          country: "US",
          phone: shippingForm.phone,
        },
      })) as unknown as Account;
      if (updated?.email) {
        setAccount(updated);
        setShippingSaved(true);
      }
    } catch {
      setError("Could not save shipping details. Please try again.");
    } finally {
      setShippingBusy(false);
    }
  }

  async function logout() {
    await getSwell().account.logout();
    setAccount(null);
    setOrders([]);
    setSubscriptions([]);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-8">
        {account
          ? "Your Account"
          : mode === "signin"
            ? "Sign In"
            : mode === "create"
              ? "Create Account"
              : "Reset Password"}
      </h1>

      {notice && (
        <p className="text-sm text-ink bg-cream-soft border border-line rounded-sm px-4 py-3 mb-6">
          {notice}
        </p>
      )}

      {loading ? (
        <p className="text-ink-soft">Loading...</p>
      ) : account ? (
        <div>
          <p className="text-ink-soft mb-10">
            Signed in as{" "}
            <span className="font-medium text-ink">{account.email}</span>
          </p>

          {/* Orders */}
          <div className="flex items-center gap-2.5 mb-4">
            <Package className="h-4 w-4 text-gold-deep" aria-hidden />
            <h2 className="font-serif-display text-xl text-ink">Orders</h2>
          </div>
          {orders.length === 0 ? (
            <p className="text-ink-soft text-sm mb-10">
              No orders yet.{" "}
              <Link href="/categories" className="underline underline-offset-4 hover:text-gold-deep">
                Browse the catalog
              </Link>
              .
            </p>
          ) : (
            <div className="border-y border-line divide-y divide-line mb-10">
              {orders.map((order) => {
                const open = openOrder === order.id;
                const shipments = order.shipments?.results || [];
                return (
                  <div key={order.id} className="py-4">
                    <button
                      type="button"
                      onClick={() => setOpenOrder(open ? null : order.id)}
                      className="w-full flex justify-between items-center gap-3 text-left"
                    >
                      <div>
                        <p className="font-medium text-ink text-sm">
                          Order #{order.number ?? ""}
                        </p>
                        <p className="text-ink-soft text-sm mt-0.5">
                          {order.date_created
                            ? new Date(order.date_created).toLocaleDateString()
                            : ""}
                          {" · "}
                          {orderStatusLabel(order)}
                        </p>
                      </div>
                      <span className="flex items-center gap-3 shrink-0">
                        <span className="font-semibold text-ink text-sm">
                          {money(order.grand_total)}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </span>
                    </button>
                    {open && (
                      <div className="mt-4 pl-1">
                        {(order.items || []).map((item, i) => (
                          <div
                            key={item.id || i}
                            className="flex justify-between text-sm py-1.5"
                          >
                            <span className="text-ink-soft">
                              {item.product?.name || "Product"} x{item.quantity}
                            </span>
                            <span className="text-ink">
                              {money(item.price_total)}
                            </span>
                          </div>
                        ))}
                        {shipments.length > 0 ? (
                          shipments.map((shipment, i) => {
                            const url = trackingUrl(shipment);
                            return (
                              <p key={i} className="text-sm text-ink-soft mt-2">
                                Tracking:{" "}
                                {url ? (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gold-deep hover:underline underline-offset-4"
                                  >
                                    {shipment.tracking_code}
                                  </a>
                                ) : (
                                  shipment.tracking_code
                                )}
                              </p>
                            );
                          })
                        ) : !order.paid && order.status !== "canceled" ? (
                          <p className="text-sm text-ink-soft mt-2">
                            Awaiting payment. Your invoice with payment
                            instructions was sent by email; your order ships
                            once payment is confirmed.
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Saved shipping details */}
          <div className="flex items-center gap-2.5 mb-4">
            <MapPin className="h-4 w-4 text-gold-deep" aria-hidden />
            <h2 className="font-serif-display text-xl text-ink">
              Shipping details
            </h2>
          </div>
          <p className="text-ink-soft text-sm mb-4">
            Saved here and pre-filled at checkout.
          </p>
          <form onSubmit={saveShipping} className="mb-10">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                className={inputClass}
                placeholder="Full name"
                required
                value={shippingForm.name}
                onChange={(e) => setShip("name", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Street address"
                required
                value={shippingForm.address1}
                onChange={(e) => setShip("address1", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Apt, suite, etc. (optional)"
                value={shippingForm.address2}
                onChange={(e) => setShip("address2", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <input
                className={inputClass}
                placeholder="City"
                required
                value={shippingForm.city}
                onChange={(e) => setShip("city", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="State"
                required
                value={shippingForm.state}
                onChange={(e) => setShip("state", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="ZIP"
                required
                value={shippingForm.zip}
                onChange={(e) => setShip("zip", e.target.value)}
              />
            </div>
            <input
              className={`${inputClass} mb-4`}
              type="tel"
              placeholder="Phone"
              value={shippingForm.phone}
              onChange={(e) => setShip("phone", e.target.value)}
            />
            <button
              type="submit"
              disabled={shippingBusy}
              className="inline-flex items-center rounded-full bg-ink text-cream px-7 py-3 label-eyebrow text-[0.68rem] hover:bg-gold-deep transition-colors disabled:opacity-60"
            >
              {shippingBusy
                ? "Saving..."
                : shippingSaved
                  ? "Saved"
                  : "Save Shipping Details"}
            </button>
          </form>

          {/* Autoship subscriptions */}
          <div className="flex items-center gap-2.5 mb-4">
            <RefreshCw className="h-4 w-4 text-gold-deep" aria-hidden />
            <h2 className="font-serif-display text-xl text-ink">
              Restock autoship
            </h2>
          </div>
          {subscriptions.length === 0 ? (
            <p className="text-ink-soft text-sm mb-10">
              No active Restock subscriptions. Choose Restock &amp; Save on
              any product to set one up.
            </p>
          ) : (
            <div className="border-y border-line divide-y divide-line mb-4">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="py-4 flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink">
                      {sub.product?.name || "Subscription"}
                    </p>
                    <p className="text-ink-soft mt-0.5">
                      {sub.status ? `${sub.status}` : ""}
                      {sub.date_order_period_end
                        ? ` · next order ${new Date(sub.date_order_period_end).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <span className="font-semibold text-ink">
                    {money(sub.recurring_total)}
                  </span>
                </div>
              ))}
            </div>
          )}
          {subscriptions.length > 0 && (
            <p className="text-xs text-ink-soft mb-10">
              To change frequency, pause, or cancel a Restock subscription,
              reply to any order email and our team will take care of it.
            </p>
          )}

          {error && (
            <p className="text-sm text-red-700 mb-6" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={logout}
            className="label-eyebrow text-[0.7rem] text-ink-soft hover:text-gold-deep transition-colors underline underline-offset-4"
          >
            Sign out
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          {mode === "create" && (
            <div className="grid grid-cols-2 gap-4 mb-4">
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
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <input
              className={inputClass}
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {mode !== "forgot" && (
              <input
                className={inputClass}
                type="password"
                placeholder="Password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            )}
          </div>

          {error && (
            <p className="text-sm text-red-700 mb-4" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center rounded-full bg-gold-deep text-cream px-8 py-3.5 label-eyebrow text-[0.72rem] hover:bg-ink transition-colors disabled:opacity-60 mb-4"
          >
            {busy
              ? "Please wait..."
              : mode === "signin"
                ? "Sign In"
                : mode === "create"
                  ? "Create Account"
                  : "Send Reset Link"}
          </button>
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "create" : "signin");
                setError(null);
              }}
              className="text-sm text-ink-soft hover:text-gold-deep transition-colors"
            >
              {mode === "signin"
                ? "New here? Create an account"
                : "Already have an account? Sign in"}
            </button>
            {mode === "signin" && (
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError(null);
                }}
                className="text-sm text-ink-soft hover:text-gold-deep transition-colors"
              >
                Forgot your password?
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountContent />
    </Suspense>
  );
}
