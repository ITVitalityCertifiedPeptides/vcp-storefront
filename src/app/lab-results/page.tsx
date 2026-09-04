import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import LabResultsBrowser, { type LotEntry } from "@/components/LabResultsBrowser";

export const metadata: Metadata = {
  title: "Lab Results",
  description:
    "Third-party Certificates of Analysis for Vitality Certified Peptides lots: identity, purity, and net content verified by an independent lab.",
  alternates: { canonical: "/lab-results" },
};

// New lots appear by dropping a PDF in public/coas/ and pushing, so this
// page reads the folder at request time instead of baking a list in at
// build time.
export const dynamic = "force-dynamic";

async function getLots(): Promise<LotEntry[]> {
  const dir = path.join(process.cwd(), "public", "coas");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".pdf"));
  } catch {
    return [];
  }

  const entries: LotEntry[] = [];
  for (const file of files) {
    const base = file.replace(/\.pdf$/i, "");
    const sep = base.indexOf("--");
    if (sep === -1) continue;
    const slug = base.slice(0, sep);
    const lot = base.slice(sep + 2);
    const product = await getProductBySlug(slug);
    entries.push({
      slug,
      lot,
      file,
      productName: product?.name || slug,
    });
  }
  return entries.sort((a, b) => a.productName.localeCompare(b.productName));
}

export default async function LabResultsPage() {
  const lots = await getLots();

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Lab Results</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-6">
        Third-party tested, lot by lot.
      </h1>
      <p className="text-ink-soft leading-relaxed mb-4">
        Every lot we sell is tested by an independent laboratory for
        identity, purity, and net content. The reports below are the actual
        Certificates of Analysis for every lot we have carried, across our
        full history - searchable by product name or lot number.
      </p>
      <p className="text-ink-soft leading-relaxed mb-10">
        When your order ships you receive tracking and a digital copy of
        the Certificate of Analysis for your exact lot.
      </p>

      {lots.length === 0 ? (
        <p className="text-ink-soft">
          Reports are being uploaded. Contact us for the Certificate of
          Analysis for any lot.
        </p>
      ) : (
        <LabResultsBrowser lots={lots} />
      )}

      <p className="text-xs text-ink-soft mt-8">
        Testing performed by an independent laboratory. Reports address
        identity, purity, and net content of the lot.{" "}
        <Link href="/quality-assurance" className="text-gold-deep hover:text-ink underline">
          See our full quality assurance process
        </Link>
        .
      </p>
    </div>
  );
}
