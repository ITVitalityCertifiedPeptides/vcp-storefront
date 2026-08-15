import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";

// Reached only by scanning the QR code printed on an order/vial label, so
// this is deliberately unlinked from navigation, the footer, and the
// sitemap, and marked noindex. See public/coas/README.md for how new
// lot PDFs get added.
export const metadata: Metadata = {
  title: "Certificate of Analysis",
  robots: { index: false, follow: false },
};

// Always check the filesystem at request time rather than pre-rendering a
// fixed set of lots, new lots get added by dropping a PDF and pushing, not
// by a code change, so there's no build-time list of valid params to
// generateStaticParams from.
export const dynamic = "force-dynamic";

function coaFileName(product: string, lot: string) {
  return `${product}--${lot}.pdf`;
}

function coaExists(product: string, lot: string): boolean {
  const filePath = path.join(process.cwd(), "public", "coas", coaFileName(product, lot));
  return fs.existsSync(filePath);
}

export default async function CoaLotPage({
  params,
}: {
  params: Promise<{ product: string; lot: string }>;
}) {
  const { product: productSlug, lot } = await params;
  const product = await getProductBySlug(productSlug);
  const found = coaExists(productSlug, lot);
  const pdfUrl = `/coas/${coaFileName(productSlug, lot)}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <p className="label-eyebrow text-gold-deep mb-2">Certificate of Analysis</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-2">
        {product ? product.name : productSlug}
      </h1>
      <p className="label-eyebrow text-[0.68rem] text-ink-soft mb-8">Lot {lot}</p>

      {found ? (
        <>
          <p className="text-ink-soft leading-relaxed mb-6">
            This Certificate of Analysis is specific to the lot printed on
            your order and vial label. If the lot number above doesn&apos;t
            match what&apos;s on your packaging, contact us before relying
            on this document.
          </p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-gold-deep text-cream px-6 py-3 label-eyebrow text-[0.72rem] hover:bg-ink transition-colors"
          >
            View / Download PDF
          </a>
        </>
      ) : (
        <div className="rounded-sm bg-cream-soft border border-line px-5 py-4">
          <p className="text-ink-soft leading-relaxed">
            We couldn&apos;t find a Certificate of Analysis for lot{" "}
            <span className="font-medium text-ink">{lot}</span>. If you
            scanned this from an order or vial label, contact us directly
            and we&apos;ll get you the document.
          </p>
        </div>
      )}
    </div>
  );
}
