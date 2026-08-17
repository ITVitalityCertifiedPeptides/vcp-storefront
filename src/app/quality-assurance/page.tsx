import type { Metadata } from "next";
import Link from "next/link";
import { qualityAssurancePoints } from "@/lib/quality-assurance";
import QualityBadges from "@/components/QualityBadges";

export const metadata: Metadata = {
  title: "Quality Assurance & Sourcing",
  description:
    "How Vitality Certified Peptides verifies what it sells: research-grade sourcing, third-party testing, lot-specific purity verification, sterility testing, and cold-chain handling.",
  alternates: { canonical: "/quality-assurance" },
};

export default function QualityAssurancePage() {
  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 pt-14 pb-4">
        <p className="label-eyebrow text-gold-deep mb-2">Trust &amp; Compliance</p>
        <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-6">
          Quality Assurance &amp; Sourcing
        </h1>
        <p className="text-ink-soft leading-relaxed mb-8">
          Our position is that research transparency, not marketing claims,
          is what earns trust with researchers. Every claim below describes
          a documented step in how we source and handle inventory — not an
          effect of any compound — and every one of them is backed by
          paperwork available on request.
        </p>
      </div>

      <QualityBadges variant="light" />

      <div className="max-w-3xl mx-auto px-4 py-14">
        {qualityAssurancePoints.map((point) => (
          <div key={point.label} className="mb-8">
            <h2 className="font-serif-display text-xl text-ink mb-3">
              {point.label}
            </h2>
            <p className="text-ink-soft leading-relaxed">{point.detail}</p>
          </div>
        ))}

        <div className="rounded-sm bg-cream-soft border border-line px-5 py-4 mt-10">
          <p className="label-eyebrow text-[0.65rem] text-ink-soft leading-relaxed">
            Documentation supporting each of these claims is on file and
            available on request. This page describes our sourcing and
            handling process only — it does not describe, and should not be
            read as describing, any effect of a compound on a person or
            animal. See our{" "}
            <Link href="/ruo-policy" className="text-gold-deep hover:text-ink underline">
              RUO Policy
            </Link>{" "}
            for the full research-use-only statement.
          </p>
        </div>
      </div>
    </div>
  );
}
