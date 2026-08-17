import type { Metadata } from "next";
import Link from "next/link";
import { qualityAssurancePoints } from "@/lib/quality-assurance";
import QualityBadges from "@/components/QualityBadges";

export const metadata: Metadata = {
  title: "Quality Assurance",
  description:
    "Every lot is third-party tested for identity and purity and ships with its own Certificate of Analysis. Research-grade sourcing, sterility testing, and cold-chain handling.",
  alternates: { canonical: "/quality-assurance" },
};

export default function QualityAssurancePage() {
  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 pt-14 pb-4">
        <p className="label-eyebrow text-gold-deep mb-2">Quality Assurance</p>
        <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-6">
          Tested, verified, and documented.
        </h1>
        <p className="text-ink-soft leading-relaxed mb-8">
          Every lot we sell is independently tested before it reaches our
          inventory, and the paperwork travels with it: when your order
          ships you receive a digital copy of the Certificate of Analysis
          for your exact lot. Here is what stands behind every order.
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
            Supporting documentation is on file and available on request.
            All products are for laboratory research use only. See our{" "}
            <Link href="/ruo-policy" className="text-gold-deep hover:text-ink underline">
              RUO Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
