"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type OrderSummary = {
  number: string;
  customer: string;
  email: string | null;
  total: string;
  items: string[];
  paid: boolean;
  canceled: boolean;
};

const inputCls = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold-deep";

export default function InvoicePortal({ staffName }: { staffName: string }) {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setOrder(null);
    try {
      const res = await fetch(`/api/staff/send-invoice?orderNumber=${encodeURIComponent(orderNumber)}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage({ ok: false, text: data.message || data.error || "Couldn't look up that order." });
      } else {
        setOrder(data.order as OrderSummary);
      }
    } catch {
      setMessage({ ok: false, text: "Network error. Try again." });
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    if (!order) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/staff/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: order.number }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setMessage({ ok: true, text: `Invoice for order #${order.number} sent to ${order.email}.` });
        setOrder(null);
        setOrderNumber("");
      } else {
        setMessage({ ok: false, text: data.message || data.error || "The invoice was not sent." });
      }
    } catch {
      setMessage({ ok: false, text: "Network error. The invoice may not have been sent. Check before trying again." });
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/staff/portal-login", { method: "DELETE" });
    router.refresh();
  }

  const blocked = order ? order.paid || order.canceled || !order.email : false;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between text-sm text-ink-soft">
        <span>
          Signed in as <span className="font-medium text-ink">{staffName}</span>
          {" · "}
          <Link href="/staff/payments" className="underline-offset-4 hover:underline">
            Log a payment
          </Link>
        </span>
        <button onClick={signOut} className="underline-offset-4 hover:underline">
          Sign out
        </button>
      </div>

      <form onSubmit={lookup} className="space-y-4 rounded-2xl border border-line bg-white p-6">
        <div>
          <label className="block text-sm font-medium" htmlFor="order">Order number</label>
          <input id="order" inputMode="numeric" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required placeholder="100096" className={inputCls} />
        </div>
        <button type="submit" disabled={busy} className="rounded-lg bg-gold-deep px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-ink disabled:opacity-60">
          {busy && !order ? "Looking up…" : "Look up order"}
        </button>
      </form>

      {order && (
        <div className="space-y-4 rounded-2xl border border-line bg-white p-6 text-sm">
          <p className="font-semibold text-ink">
            Order #{order.number} · {order.total}
          </p>
          <p className="text-ink-soft">
            {order.customer || "Customer"}
            {order.email ? ` · ${order.email}` : " · no email on file"}
          </p>
          <ul className="list-disc pl-5 text-ink">
            {order.items.map((i, n) => (
              <li key={n}>{i}</li>
            ))}
          </ul>
          {order.paid && <p className="text-red-900">This order is already paid. No invoice needed.</p>}
          {order.canceled && <p className="text-red-900">This order is canceled.</p>}
          {!order.email && <p className="text-red-900">There is no customer email on this order.</p>}
          <button
            onClick={send}
            disabled={busy || blocked}
            className="rounded-lg bg-gold-deep px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-ink disabled:opacity-60"
          >
            {busy ? "Sending…" : `Send invoice to ${order.email ?? "customer"}`}
          </button>
        </div>
      )}

      {message && (
        <div
          role="status"
          className={`rounded-xl border p-4 text-sm ${message.ok ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
