"use client";

// Password reset landing page. The reset email (sent from /account via
// account.recover) links here with ?key={reset_key}; submitting sets the
// new password through the same recover endpoint.

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSwell } from "@/lib/swell-client";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const resetKey = params.get("key");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-sm border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-gold-deep";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await getSwell().account.recover({
        password,
        reset_key: resetKey || "",
      });
      router.push("/account");
    } catch {
      setError(
        "Could not reset the password. The link may have expired; request a new one from the sign-in page."
      );
      setBusy(false);
    }
  }

  if (!resetKey) {
    return (
      <p className="text-ink-soft">
        This reset link is missing its key. Request a new one from the
        sign-in page.
      </p>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <input
          className={inputClass}
          type="password"
          placeholder="New password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className={inputClass}
          type="password"
          placeholder="Confirm new password"
          required
          minLength={6}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        className="w-full inline-flex items-center justify-center rounded-full bg-gold-deep text-cream px-8 py-3.5 label-eyebrow text-[0.72rem] hover:bg-ink transition-colors disabled:opacity-60"
      >
        {busy ? "Saving..." : "Set New Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <h1 className="font-serif-display text-3xl text-ink mb-8">
        Set a new password
      </h1>
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </div>
  );
}
