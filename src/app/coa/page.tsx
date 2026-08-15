import type { Metadata } from "next";

// This page is intentionally not linked from site navigation, the footer,
// or the sitemap. It's reached only by scanning the QR code printed on an
// order and on the vial label itself, so it's not meant to be publicly
// browsable or indexed - noindex reflects that on purpose.
export const metadata: Metadata = {
  title: "Certificates of Analysis",
  description:
    "How Vitality Certified Peptides sources and verifies lot-specific Certificates of Analysis for every research compound sold.",
  alternates: { canonical: "/coa" },
  robots: { index: false, follow: false },
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
        COA documentation is not published on this site publicly. Each order
        and vial label carries a QR code that resolves to the Certificate of
        Analysis for that specific lot. If you have a lot in hand and can&apos;t
        locate its QR code, contact us directly and we will provide it.
      </p>
      <div className="rounded-sm bg-cream-soft border border-line px-5 py-4">
        <p className="label-eyebrow text-[0.65rem] text-ink-soft">
          This page is reached only via QR code and is not linked from site
          navigation. Per-lot COA document lookup by QR code is planned but
          not yet built.
        </p>
      </div>
    </div>
  );
}
