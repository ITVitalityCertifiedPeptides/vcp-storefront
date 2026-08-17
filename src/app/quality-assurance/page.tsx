import type { Metadata } from "next";
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
      {/* Full-width banner; the badges and the five points below it stand
          on their own as the testament, no explanatory copy. */}
      <section className="bg-ink text-cream border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-24 text-center">
          <p className="label-eyebrow text-[0.7rem] tracking-[0.2em] text-gold mb-4">
            Tested &middot; Verified &middot; Documented
          </p>
          <h1 className="font-serif-display text-4xl md:text-5xl">
            Quality Assurance
          </h1>
        </div>
      </section>

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
      </div>
    </div>
  );
}
