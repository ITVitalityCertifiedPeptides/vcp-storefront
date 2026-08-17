"use client";

import { useState } from "react";

export default function FooterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { error?: string };
      if (response.ok) {
        setState("done");
        setMessage("You're on the list.");
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
    <form onSubmit={submit} className="mt-4">
      <label className="label-eyebrow text-[0.62rem] text-cream/60 block mb-2">
        Get stock updates and new lot notices
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
          {state === "busy" ? "..." : "Sign Up"}
        </button>
      </div>
      {state === "error" && (
        <p className="text-red-400 text-xs mt-2">{message}</p>
      )}
    </form>
  );
}
