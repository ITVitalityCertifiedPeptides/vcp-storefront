import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificates of Analysis",
  description:
    "How Vitality Certified Peptides sources and verifies lot-specific Certificates of Analysis for every research compound sold.",
  alternates: { canonical: "/coa" },
};

export default function CoaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-4">Certificates of Analysis</h1>
      <p className="text-neutral-600 mb-4">
        A lot-specific Certificate of Analysis (COA) is required from our
        suppliers for every SKU we carry, provided prior to or accompanying
        shipment. This is a standing requirement of our supplier agreements,
        not an optional add-on.
      </p>
      <p className="text-neutral-600 mb-4">
        COA documentation for each lot will be linked from the corresponding
        product page once the catalog is live. If you need a COA for a lot
        you have already received and can&apos;t find it here, contact us
        directly and we will provide it.
      </p>
      <p className="text-neutral-500 text-sm mt-8">
        This page is a placeholder pending final COA hosting setup.
      </p>
    </div>
  );
}
