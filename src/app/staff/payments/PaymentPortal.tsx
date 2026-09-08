"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PAYMENT_SOURCES, type LoggedPayment, type PaymentResult } from "@/lib/staff-payments";

const todayLocal = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const $ = (n: number) => `$${n.toFixed(2)}`;

const inputCls = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold-deep";

export default function PaymentPortal({ staffName }: { staffName: string }) {
  const router = useRouter();
  const [dateReceived, setDateReceived] = useState(todayLocal());
  const [source, setSource] = useState<(typeof PAYMENT_SOURCES)[number] | "">("");
  const [sourceOther, setSourceOther] = useState("");
  const [grossAmount, setGrossAmount] = useState("");
  const [fees, setFees] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [recent, setRecent] = useState<LoggedPayment[] | null>(null);
  const [recentError, setRecentError] = useState<string | null>(null);

  const loadRecent = useCallback(async () => {
    try {
      const res = await fetch("/api/staff/payments", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      setRecent(data.payments);
      setRecentError(null);
    } catch (e) {
      setRecentError(e instanceof Error ? e.message : "Couldn't load recent payments.");
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(loadRecent, 0);
    return () => clearTimeout(t);
  }, [loadRecent]);

  const net = (() => {
    const g = Number(grossAmount.replace(/[$,\s]/g, ""));
    const f = Number((fees || "0").replace(/[$,\s]/g, ""));
    return Number.isFinite(g) && Number.isFinite(f) && g > 0 ? g - f : null;
  })();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/staff/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateReceived, source, sourceOther, grossAmount, fees: fees || "0", orderNumber, note }),
      });
      const data = (await res.json()) as PaymentResult;
      setResult(data);
      if (data.ok) {
        setGrossAmount("");
        setFees("");
        setOrderNumber("");
        setNote("");
        setSourceOther("");
        setSource("");
        loadRecent();
      }
    } catch {
      setResult({ ok: false, code: "invalid", message: "Network error. Nothing was recorded. Try again." });
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/staff/portal-login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between text-sm text-ink-soft">
        <span>
          Signed in as <span className="font-medium text-ink">{staffName}</span>
        </span>
        <button onClick={signOut} className="underline-offset-4 hover:underline">
          Sign out
        </button>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-line bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium" htmlFor="date">Date payment received</label>
            <input id="date" type="date" value={dateReceived} onChange={(e) => setDateReceived(e.target.value)} required max={todayLocal()} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="source">Received through</label>
            <select id="source" value={source} onChange={(e) => setSource(e.target.value as (typeof PAYMENT_SOURCES)[number])} required className={inputCls}>
              <option value="" disabled>
                Choose one
              </option>
              {PAYMENT_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {source === "Other" && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium" htmlFor="sourceOther">What was it?</label>
              <input id="sourceOther" value={sourceOther} onChange={(e) => setSourceOther(e.target.value)} required placeholder="e.g. Cash App, money order" className={inputCls} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium" htmlFor="gross">Amount received (before fees)</label>
            <input id="gross" inputMode="decimal" value={grossAmount} onChange={(e) => setGrossAmount(e.target.value)} required placeholder="0.00" className={inputCls} />
            <p className="mt-1 text-xs text-ink-soft">Must match the order total exactly.</p>
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="fees">Transaction fees (if any)</label>
            <input id="fees" inputMode="decimal" value={fees} onChange={(e) => setFees(e.target.value)} placeholder="0.00" className={inputCls} />
            <p className="mt-1 text-xs text-ink-soft">Wire fees, PayPal or Venmo fees, etc.{net !== null && fees ? ` Net ${$(net)}.` : ""}</p>
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="order">Order number</label>
            <input id="order" inputMode="numeric" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required placeholder="000000" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="note">Note (optional)</label>
            <input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Sender name on the payment, memo text…" className={inputCls} />
          </div>
        </div>

        <button type="submit" disabled={busy} className="w-full rounded-lg bg-gold-deep px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-ink disabled:opacity-60 sm:w-auto sm:px-8">
          {busy ? "Checking order…" : "Record payment"}
        </button>

        {result && (
          <div
            role="status"
            className={`rounded-xl border p-4 text-sm ${
              result.ok ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"
            }`}
          >
            {result.ok ? (
              <>
                <p className="font-semibold">Order #{result.orderNumber} marked paid.</p>
                <p className="mt-1">
                  {$(result.amount)} recorded for {result.customer}
                  {result.net !== result.amount ? ` (${$(result.net)} after fees)` : ""}. The order moved to Ready to ship and the customer&rsquo;s
                  &ldquo;Payment received&rdquo; email is on its way.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">
                  {result.code === "not_found" && "Order not found"}
                  {result.code === "amount_mismatch" && "Amount doesn't match"}
                  {result.code === "already_paid" && "Already paid"}
                  {result.code === "canceled" && "Order is canceled"}
                  {result.code === "invalid" && "Couldn't record that"}
                </p>
                <p className="mt-1">{result.message}</p>
                {result.code === "amount_mismatch" && typeof result.expected === "number" && (
                  <p className="mt-2 text-base font-semibold">Expected: {$(result.expected)}</p>
                )}
              </>
            )}
          </div>
        )}
      </form>

      <section>
        <h2 className="text-lg font-semibold">Recent payments logged</h2>
        {recentError && <p className="mt-2 text-sm text-red-700">{recentError}</p>}
        {recent && recent.length === 0 && <p className="mt-2 text-sm text-ink-soft">Nothing logged yet.</p>}
        {recent && recent.length > 0 && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-cream-soft text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-3 py-2">Received</th>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Via</th>
                  <th className="px-3 py-2 text-right">Gross</th>
                  <th className="px-3 py-2 text-right">Fees</th>
                  <th className="px-3 py-2 text-right">Net</th>
                  <th className="px-3 py-2">By</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((p) => (
                  <tr key={p.id} className="border-t border-line">
                    <td className="px-3 py-2 whitespace-nowrap">{p.dateReceived}</td>
                    <td className="px-3 py-2">#{p.orderNumber}</td>
                    <td className="px-3 py-2">{p.customer}</td>
                    <td className="px-3 py-2">{p.source}</td>
                    <td className="px-3 py-2 text-right">{$(p.gross)}</td>
                    <td className="px-3 py-2 text-right">{p.fees ? $(p.fees) : "none"}</td>
                    <td className="px-3 py-2 text-right">{$(p.net)}</td>
                    <td className="px-3 py-2">{p.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
