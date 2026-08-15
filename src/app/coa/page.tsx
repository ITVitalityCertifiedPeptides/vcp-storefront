import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificates of Analysis",
  description:
    "How Vitality Certified Peptides sources and verifies lot-specific Certificates of Analysis for every research compound sold.",
  alternates: { canonical: "/coa" },
};

export default function CoaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Trust &amp; Compliance</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-6">
        Certificates of Analysis
      </h1>
      <p className="text-ink-soft leading-relaxed mb-4">
        A lot-specific Certificate of Analysis (COA) is required from our
        suppliers for every SKU we carry, provided prior to or accompanying
        shipment. This is a standing requirement of our supplier agreements,
        not an optional add-on.
      </p>
      <p className="text-ink-soft leading-relaxed mb-8">
        COA documentation for each lot will be linked from the corresponding
        product page once the catalog is live. If you need a COA for a lot
        you have already received and can&apos;t find it here, contact us
        directly and we will provide it.
      </p>
      <div className="rounded-sm bg-cream-soft border border-line px-5 py-4">
        <p className="label-eyebrow text-[0.65rem] text-ink-soft">
          This page is a placeholder pending final COA hosting setup.
        </p>
      </div>
    </div>
  );
}
