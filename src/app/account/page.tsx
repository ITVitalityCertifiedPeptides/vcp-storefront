"use client";

import { useCallback, useEffect, useState } from "react";
import { getSwell } from "@/lib/swell-client";

type Account = {
  email?: string;
  first_name?: string;
  last_name?: string;
} | null;

type Order = {
  id: string;
  number?: string | number;
  date_created?: string;
  grand_total?: number;
  status?: string;
};

function money(n?: number) {
  return typeof n === "number" ? `$${n.toFixed(2)}` : "";
}

export default function AccountPage() {
  const [account, setAccount] = useState<Account>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-gold-deep";

  const loadOrders = useCallback(async () => {
    try {
      const result = (await getSwell().account.listOrders({
        limit: 10,
      })) as unknown as { results?: Order[] } | null;
      setOrders(result?.results || []);
    } catch {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const current = (await getSwell().account.get()) as unknown as Account;
        if (cancelled) return;
        setAccount(current?.email ? current : null);
        if (current?.email) await loadOrders();
      } catch {
        if (!cancelled) setAccount(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadOrders]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const swell = getSwell();
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
      } else {
        setAccount(logged);
        await loadOrders();
      }
    } catch {
      setError(
        mode === "signin"
          ? "Invalid email or password."
          : "Could not create the account. It may already exist, try signing in."
      );
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await getSwell().account.logout();
    setAccount(null);
    setOrders([]);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-14">
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-8">
        {account ? "Your Account" : mode === "signin" ? "Sign In" : "Create Account"}
      </h1>

      {loading ? (
        <p className="text-ink-soft">Loading...</p>
      ) : account ? (
        <div>
          <p className="text-ink-soft mb-8">
            Signed in as <span className="font-medium text-ink">{account.email}</span>
          </p>

          <h2 className="font-serif-display text-xl text-ink mb-4">Recent orders</h2>
          {orders.length === 0 ? (
            <p className="text-ink-soft text-sm mb-8">No orders yet.</p>
          ) : (
            <div className="border-y border-line divide-y divide-line mb-8">
              {orders.map((order) => (
                <div key={order.id} className="py-4 flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-ink">
                      Order #{order.number ?? ""}
                    </p>
                    <p className="text-ink-soft mt-0.5">
                      {order.date_created
                        ? new Date(order.date_created).toLocaleDateString()
                        : ""}
                      {order.status ? ` · ${order.status}` : ""}
                    </p>
                  </div>
                  <span className="font-semibold text-ink">
                    {money(order.grand_total)}
                  </span>
                </div>
              ))}
            </div>
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
            <input
              className={inputClass}
              type="password"
              placeholder="Password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
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
                : "Create Account"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "create" : "signin");
              setError(null);
            }}
            className="w-full text-center text-sm text-ink-soft hover:text-gold-deep transition-colors"
          >
            {mode === "signin"
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </form>
      )}
    </div>
  );
}
