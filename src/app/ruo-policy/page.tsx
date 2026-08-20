import type { Metadata } from "next";
import { ruoNotice, ruoPolicySections } from "@/lib/site";
import { restrictedStateNames } from "@/lib/restricted-states";

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
      <p className="text-ink-soft leading-relaxed mb-10">{ruoNotice}</p>

      {ruoPolicySections.map((section) => (
        <div key={section.heading} className="mb-8">
          <h2 className="font-serif-display text-xl text-ink mb-3">
            {section.heading}
          </h2>
          <p className="text-ink-soft leading-relaxed">{section.body}</p>
        </div>
      ))}

      <h2 className="font-serif-display text-xl text-ink mb-3">
        How we describe compounds
      </h2>
      <p className="text-ink-soft leading-relaxed mb-8">
        All public-facing content on this site describes compounds in terms
        of what has been studied or researched in the scientific literature,
        never in terms of what a compound does for a person who takes it.
        We do not publish, link to, or in any way facilitate access to
        dosage or human-consumption information.
      </p>

      <h2 className="font-serif-display text-xl text-ink mb-3">
        State shipping restrictions
      </h2>
      <p className="text-ink-soft leading-relaxed mb-4">
        Vitality Certified Peptides does not sell or ship to the following
        states:
      </p>
      <ul className="space-y-2 mb-4">
        {restrictedStateNames.map((state) => (
          <li key={state} className="flex items-center gap-3 text-ink font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" aria-hidden />
            {state}
          </li>
        ))}
      </ul>
      <p className="text-ink-soft leading-relaxed text-sm">
        Orders with a shipping address in these states cannot be fulfilled
        and will be canceled and refunded. This list reflects current
        state-level regulation and enforcement activity and is reviewed
        regularly; it may change as state law changes.
      </p>
    </div>
  );
}
