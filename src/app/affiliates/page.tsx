import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description:
    "Vitality Certified Peptides affiliate program: commission structure, cookie window, and enrollment.",
  alternates: { canonical: "/affiliates" },
};

const terms = [
  "10% base commission on product subtotal (excl. shipping/tax/discounts)",
  "12% after $5,000 in lifetime referred sales; 15% after $15,000",
  "30-day cookie window, refreshed on most recent click",
  "$50 minimum payout, paid monthly on a net-30 schedule",
  "Approval-required enrollment, 24–48 hour review",
];

export default function AffiliatesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Partner With Us</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-8">
        Affiliate Program
      </h1>
      <ul className="space-y-3 mb-8">
        {terms.map((term) => (
          <li key={term} className="flex items-start gap-3 text-ink-soft leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" aria-hidden />
            {term}
          </li>
        ))}
      </ul>
      <div className="rounded-sm bg-cream-soft border border-line px-5 py-4">
        <p className="label-eyebrow text-[0.65rem] text-ink-soft leading-relaxed">
          Enrollment opens at launch. This page is a placeholder pending the
          Tapfiliate integration and the mandatory affiliate compliance
          onboarding document referenced in the GTM plan.
        </p>
      </div>
    </div>
  );
}
