import type { Metadata } from "next";
import { ruoNotice } from "@/lib/site";

export const metadata: Metadata = {
  title: "Research Use Only Policy",
  description:
    "Vitality Certified Peptides' Research Use Only (RUO) policy: what it means, who can buy, and how we describe compounds.",
  alternates: { canonical: "/ruo-policy" },
};

export default function RuoPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Trust &amp; Compliance</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-6">
        Research Use Only (RUO) Policy
      </h1>
      <p className="text-ink-soft leading-relaxed mb-8">{ruoNotice}</p>

      <h2 className="font-serif-display text-xl text-ink mt-10 mb-3">
        How we describe compounds
      </h2>
      <p className="text-ink-soft leading-relaxed mb-8">
        All public-facing content on this site describes compounds in terms
        of what has been studied or researched in the scientific literature,
        never in terms of what a compound does for a person who takes it.
        We do not publish, link to, or in any way facilitate access to
        dosage or human-consumption information.
      </p>

      <div className="rounded-sm bg-cream-soft border border-line px-5 py-4">
        <p className="label-eyebrow text-[0.65rem] text-ink-soft leading-relaxed">
          This page is preliminary and subject to attorney review before
          launch. Final language pending legal sign-off on the
          state-by-state risk matrix and label compliance review.
        </p>
      </div>
    </div>
  );
}
