"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NAME_KEY = "vcp_staff_user";

export default function StaffLogin() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Remember the last name used on this device (after mount, so the
    // server and client render the same empty field first).
    const t = setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(NAME_KEY);
        if (saved) setName(saved);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/staff/portal-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Couldn't sign in.");
        return;
      }
      try {
        window.localStorage.setItem(NAME_KEY, name.trim());
      } catch {}
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md space-y-4 rounded-2xl border border-line bg-white p-6">
      <div>
        <label className="block text-sm font-medium" htmlFor="staff-name">Email</label>
        <input
          id="staff-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="email"
          autoComplete="username"
          autoCapitalize="none"
          required
          className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold-deep"
          placeholder="you@vitalitycertifiedpeptides.com"
        />
        <p className="mt-1 text-xs text-ink-soft">Every payment you log is recorded under your name.</p>
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="staff-password">Password</label>
        <input
          id="staff-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold-deep"
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-gold-deep px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-ink disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
