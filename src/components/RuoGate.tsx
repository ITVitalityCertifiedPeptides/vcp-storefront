"use client";

// One-time entry acknowledgment, the same pattern the rest of the
// industry uses (age/qualification gate at the door). Acknowledging it is
// remembered in the browser, so returning visitors are not nagged. Having
// this at the door is what lets the rest of the site keep research-use
// language down to the footer, the policy pages, and checkout.

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "vcp-ruo-acknowledged";

export default function RuoGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Deferred a tick so the gate check runs after hydration rather than
    // synchronously inside the effect body.
    const id = window.setTimeout(() => {
      try {
        if (!window.localStorage.getItem(STORAGE_KEY)) setOpen(true);
      } catch {
        // Storage unavailable (private browsing edge cases): stay closed
        // rather than trapping the visitor behind a gate that can't persist.
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // Ignore storage failures; close for this visit regardless.
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ruo-gate-title"
    >
      <div className="max-w-md w-full bg-cream rounded-sm border border-line p-8 text-center">
        <p className="label-eyebrow text-[0.65rem] text-gold-deep mb-3">
          Vitality Certified Peptides
        </p>
        <h2 id="ruo-gate-title" className="font-serif-display text-2xl text-ink mb-4">
          Research Use Only
        </h2>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">
          Products on this site are sold for laboratory research use only
          and are not for human or veterinary use. By entering, you confirm
          you are 21 or older and purchasing for research purposes.
        </p>
        <button
          type="button"
          onClick={accept}
          className="w-full inline-flex items-center justify-center rounded-full bg-gold-deep text-cream px-8 py-3.5 label-eyebrow text-[0.72rem] hover:bg-ink transition-colors mb-4"
        >
          I Understand, Enter Site
        </button>
        <Link
          href="/ruo-policy"
          onClick={accept}
          className="text-xs text-ink-soft hover:text-gold-deep transition-colors underline underline-offset-4"
        >
          Read the full Research Use Only policy
        </Link>
      </div>
    </div>
  );
}
