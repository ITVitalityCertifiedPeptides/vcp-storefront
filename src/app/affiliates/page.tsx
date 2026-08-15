import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description:
    "Vitality Certified Peptides affiliate program: commission structure, cookie window, and enrollment.",
  alternates: { canonical: "/affiliates" },
};

export default function AffiliatesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Affiliate Program</h1>
      <ul className="text-neutral-600 space-y-2 mb-6">
        <li>10% base commission on product subtotal (excl. shipping/tax/discounts)</li>
        <li>12% after $5,000 in lifetime referred sales; 15% after $15,000</li>
        <li>30-day cookie window, refreshed on most recent click</li>
        <li>$50 minimum payout, paid monthly on a net-30 schedule</li>
        <li>Approval-required enrollment, 24&ndash;48 hour review</li>
      </ul>
      <p className="text-neutral-500 text-sm">
        Enrollment opens at launch. This page is a placeholder pending the
        Tapfiliate integration and the mandatory affiliate compliance
        onboarding document referenced in the GTM plan.
      </p>
    </div>
  );
}
