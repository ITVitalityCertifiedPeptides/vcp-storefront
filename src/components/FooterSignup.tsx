"use client";

import { useState } from "react";

export default function FooterSignup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sms, setSms] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    try {
      // /api/optin upserts the Swell account (the old /api/subscribe failed
      // on any email that already had an account).
      const response = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, emailOptin: true, smsOptin: sms, source: "footer" }),
      });
      const data = (await response.json()) as { error?: string };
      if (response.ok) {
        setState("done");
        setMessage(sms ? "You're on the list, email and text." : "You're on the list.");
      } else {
        setState("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (state === "done") {
    return <p className="text-gold text-sm mt-4">{message}</p>;
  }

  return (
    <form onSubmit={submit} className="mt-5">
      <p className="label-eyebrow text-[0.7rem] text-gold mb-1.5">
        Join Our Priority List
      </p>
      <label className="text-xs text-cream/60 leading-relaxed block mb-2.5">
        Early access to new compounds, back-in-stock notices, and private offers,
        delivered to your inbox.
      </label>
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 min-w-0 rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={state === "busy"}
          className="rounded-full bg-gold text-ink px-4 py-2 label-eyebrow text-[0.62rem] hover:bg-cream transition-colors disabled:opacity-60 shrink-0"
        >
          {state === "busy" ? "..." : "Subscribe"}
        </button>
      </div>
      <label className="flex items-start gap-2 mt-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={sms}
          onChange={(e) => setSms(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 accent-[#c89a3e]"
        />
        <span className="text-xs text-cream/60 leading-relaxed">Text me closeouts too (some go out by text only)</span>
      </label>
      {sms && (
        <div className="mt-2">
          <input
            type="tel"
            required
            placeholder="Mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-sm border border-white/15 bg-white/5 px-3 py-2 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold"
          />
          <p className="text-[0.65rem] text-cream/40 leading-relaxed mt-1.5">
            By checking the box you agree to receive occasional automated marketing texts from Vitality Certified Peptides. Consent is not a condition of purchase. Msg &amp; data rates may apply. Reply STOP to opt out, HELP for help.
          </p>
        </div>
      )}
      {state === "error" && (
        <p className="text-red-400 text-xs mt-2">{message}</p>
      )}
    </form>
  );
}
