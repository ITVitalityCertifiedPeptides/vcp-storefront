"use client";

// Researcher registration (2026-08-27, Josh's spec): name, email, phone,
// and a password (needed for /login afterward). No pricing or catalog
// content is visible from this page - it's reachable from the public site
// and links back to /login for existing accounts.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-gold-deep";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error || "Could not create your account. Please try again.");
        return;
      }
      router.push("/pending-approval");
    } catch {
      setError("Could not create your account. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-14">
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-4">
        Register as a Researcher
      </h1>
      <p className="text-ink-soft text-sm mb-8">
        Our catalog and pricing are available to approved researchers. Create
        an account below and our team will review it - you&rsquo;ll get an
        email once you&rsquo;re approved to sign in and shop.
      </p>

      <form onSubmit={submit}>
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
            type="tel"
            placeholder="Phone"
            required
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
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
          {busy ? "Submitting..." : "Request Access"}
        </button>
        <p className="text-center text-sm text-ink-soft">
          Already approved?{" "}
          <Link href="/login" className="text-gold-deep hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
