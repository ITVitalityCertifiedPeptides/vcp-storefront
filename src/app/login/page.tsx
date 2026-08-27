"use client";

// Researcher login (2026-08-27). Does two things on submit: (1) POSTs to
// our own /api/auth/login, which verifies against Swell and - if
// approved - sets our signed gate cookie that middleware checks; (2) also
// calls swell.account.login() client-side, the same call the existing
// /account page uses, so cart/checkout/order-history keep working through
// the normal Swell session. Both are needed; see src/lib/session.ts.

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSwell } from "@/lib/swell-client";

const inputClass =
  "w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-gold-deep";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const rawReturn = params.get("return") || "";
  const returnTo = rawReturn.startsWith("/") && !rawReturn.startsWith("//") ? rawReturn : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok: boolean; pending?: boolean; error?: string };
      if (!data.ok) {
        setError(data.error || "Incorrect email or password.");
        return;
      }
      if (data.pending) {
        router.push("/pending-approval");
        return;
      }
      // Also sign into the normal Swell session for cart/checkout/orders.
      // Best-effort: if this fails, the researcher-gate login above still
      // succeeded, so we don't block them over it.
      try {
        await getSwell().account.login(email, password);
      } catch {
        // ignore - non-fatal
      }
      router.push(returnTo);
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-4">
        Researcher Sign In
      </h1>
      <p className="text-ink-soft text-sm mb-8">
        Our catalog and pricing are available to approved researchers only.
      </p>

      <form onSubmit={submit}>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <input
            className={inputClass}
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={inputClass}
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {busy ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-center text-sm text-ink-soft">
          Not registered yet?{" "}
          <Link href="/register" className="text-gold-deep hover:underline underline-offset-4">
            Request access
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
