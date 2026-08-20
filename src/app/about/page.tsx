import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Vitality Certified Peptides: US-made research compounds with independent third-party testing, a Certificate of Analysis on every lot, and direct everyday pricing.",
  alternates: { canonical: "/about" },
};

// Structure mirrors the strongest competitor about pages (quality,
// guarantee, fulfillment, testing, transparency) in VCP's own words.
// Deliberately NO mission-statement section per Josh, and no safety or
// benefit claims anywhere: quality claims are about identity, purity, and
// documentation, never about effects.
const sections = [
  {
    heading: "Quality you can verify",
    body: "Every compound we carry is synthesized in the USA and tested by an independent third-party laboratory using HPLC and LC-MS, covering identity, purity, and net content. We publish the Certificate of Analysis for every lot we sell, and a digital copy of your exact lot's COA is delivered with every order. We never ask you to take quality on faith; the documentation is the product's resume, and it is always available.",
  },
  {
    heading: "Our guarantee",
    body: "If a lot we shipped ever fails independent verification against its published Certificate of Analysis, we replace it or refund it in full. Because we source directly and skip the middlemen, our listed price is the price, every day, with no gimmick codes. If something arrives damaged or incorrect, tell us within 7 days and we make it right.",
  },
  {
    heading: "Service and fulfillment",
    body: "In-stock orders ship within 1 business day, Monday through Friday, from within the United States. Every shipment includes tracking, and US shipping is free on orders over $250 and on Scheduled Restock orders over $75. Questions are answered by a real person, usually within 1 business day.",
  },
  {
    heading: "Third-party testing, not self-grading",
    body: "We do not grade our own homework. Each lot goes to an independent laboratory for multi-stage analysis before it is released for sale, and the resulting Certificate of Analysis is published on our Lab Results page and linked from each product's Batch Testing section. See our Quality Assurance page for the full process, from receiving to release.",
  },
  {
    heading: "Transparency",
    body: "Beyond the COAs, we maintain a Research Library of peer-reviewed literature citations for every compound in the catalog, with verified PubMed references and no editorializing. Every product page lists the compound's CAS number, molecular formula, molar mass, and sequence where applicable, so you always know exactly what is in the vial.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Who We Are</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-6">
        About Vitality Certified Peptides
      </h1>
      <p className="text-ink-soft leading-relaxed mb-10">
        Vitality Certified Peptides supplies US-made, research-use-only
        compounds to qualified researchers, with independent third-party
        testing behind every vial and direct pricing every day. Everything
        we sell is for laboratory research use only; nothing on this site
        is for human or veterinary use.
      </p>

      {sections.map((section) => (
        <div key={section.heading} className="mb-8">
          <h2 className="font-serif-display text-xl text-ink mb-3">
            {section.heading}
          </h2>
          <p className="text-ink-soft leading-relaxed">{section.body}</p>
        </div>
      ))}

      <div className="rounded-sm bg-cream-soft border border-line px-5 py-5 text-center mt-10">
        <p className="text-ink-soft leading-relaxed mb-4">
          See exactly how we verify what we sell, or browse the published
          literature behind every compound.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/quality-assurance"
            className="inline-flex items-center rounded-full bg-gold-deep text-cream px-7 py-3 label-eyebrow text-[0.7rem] hover:bg-ink transition-colors"
          >
            Quality Assurance
          </Link>
          <Link
            href="/research"
            className="inline-flex items-center rounded-full border border-gold-deep text-gold-deep px-7 py-3 label-eyebrow text-[0.7rem] hover:bg-gold-deep hover:text-cream transition-colors"
          >
            Research Library
          </Link>
        </div>
      </div>
    </div>
  );
}
