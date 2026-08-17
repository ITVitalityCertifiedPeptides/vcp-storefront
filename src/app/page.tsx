import Link from "next/link";
import type { Metadata } from "next";
import { FlaskConical, ShieldCheck, FileCheck2, Microscope, ArrowRight } from "lucide-react";
import { getAllCategories, getAllProducts, categorySlug } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { faqSchema } from "@/lib/schema";
import ProductCard from "@/components/ProductCard";
import VialIcon from "@/components/VialIcon";
import QualityBadges from "@/components/QualityBadges";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Research-Grade Compounds, RUO`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const trustPoints = [
  {
    icon: FileCheck2,
    label: "Certificate of Analysis",
    detail: "Issued for every lot, verified by QR code on arrival",
  },
  {
    icon: ShieldCheck,
    label: "RUO Compliant",
    detail: "Research use only, never marketed for human use",
  },
  {
    icon: Microscope,
    label: "Qualified Researchers",
    detail: "Sold to labs & institutions, not consumers",
  },
  {
    icon: FlaskConical,
    label: "Documented Purity",
    detail: "Identity and purity confirmed lot by lot",
  },
];

// Kept strictly to policy/logistics questions - never anything framed as
// "what does this do" or dosing guidance, per the RUO compliance principle
// that governs every other page on this site.
const faqs = [
  {
    question: "What does Research Use Only (RUO) mean?",
    answer:
      "RUO means every compound we sell is intended strictly for laboratory research, not for human or veterinary use, diagnostic use, or any use governed by the FD&C Act. See our RUO Policy page for the full statement.",
  },
  {
    question: "Do you provide a Certificate of Analysis (COA)?",
    answer:
      "Yes. A lot-specific Certificate of Analysis is required from our suppliers for every SKU we carry. Rather than a public archive, each COA is reached by scanning the QR code on your order and vial label, tied to the exact lot you received.",
  },
  {
    question: "Who can purchase from Vitality Certified Peptides?",
    answer:
      "Our products are sold to qualified researchers, laboratories, and institutions purchasing for research purposes only.",
  },
  {
    question: "How do I find a compound's CAS number or category?",
    answer:
      "Every product page lists its CAS number and research category. You can also browse the full catalog by category from the Research Categories page.",
  },
];

// "How we describe compounds" comparison - a more concrete substitute for
// a vague trust paragraph, showing the actual line the site won't cross.
const languagePairs = [
  {
    wont: "“Helps with recovery and performance.”",
    will: "“Studied in preclinical models for tissue repair.”",
  },
  {
    wont: "“Take 250mcg daily for best results.”",
    will: "“No dosing guidance for human or animal use, ever.”",
  },
  {
    wont: "“Customers say they feel amazing.”",
    will: "“Certificate of Analysis on every lot, not testimonials.”",
  },
];

export default async function HomePage() {
  const categories = await getAllCategories();
  const products = await getAllProducts();
  const featured = products.slice(0, 6);

  return (
    <div>
      <section className="border-b border-line overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="pt-16 md:pt-20 pb-14 lg:pr-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-deep/30 bg-gold-deep/5 px-3.5 py-1.5 label-eyebrow text-[0.66rem] text-gold-deep mb-7">
              <FileCheck2 className="h-3.5 w-3.5" aria-hidden />
              Lot-verified Certificate of Analysis
            </span>
            <h1 className="text-[2.6rem] md:text-[3.4rem] leading-[1.03] font-semibold tracking-tight text-ink max-w-xl">
              Research compounds,
              <br />
              documented down to the lot.
            </h1>
            <p className="mt-6 text-ink-soft max-w-lg text-lg leading-relaxed">
              {siteConfig.name} supplies laboratory research use only (RUO)
              compounds for qualified research settings. Every product is
              sold strictly for research use, not for human or veterinary
              consumption.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-full bg-gold-deep text-cream px-7 py-3.5 label-eyebrow text-[0.72rem] hover:bg-ink transition-colors"
              >
                Browse the Catalog
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                href="/ruo-policy"
                className="label-eyebrow text-[0.72rem] text-ink hover:text-gold-deep transition-colors underline decoration-line underline-offset-4"
              >
                Read our RUO policy
              </Link>
            </div>
            <p className="mt-8 text-xs text-ink-soft/70 label-eyebrow tracking-[0.12em]">
              For Laboratory Research Use Only. Not for human or veterinary use.
            </p>
          </div>
          <div className="relative bg-ink text-cream flex items-center justify-center min-h-[280px] lg:min-h-0">
            <div className="absolute inset-0 bg-dot-grid text-cream/[0.08]" aria-hidden />
            <div className="relative flex flex-col items-center gap-5 py-14">
              <VialIcon className="h-28 w-28 text-gold/70" />
              <div className="rounded-sm border border-cream/15 bg-cream/[0.04] px-5 py-3 text-center">
                <p className="label-eyebrow text-[0.6rem] text-cream/50 mb-1">
                  Certificate of Analysis
                </p>
                <p className="label-eyebrow text-[0.62rem] text-gold">
                  Verified via QR &middot; Lot-specific
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point) => (
            <div key={point.label} className="flex items-start gap-3.5">
              <point.icon className="h-5 w-5 text-gold shrink-0 mt-0.5" aria-hidden />
              <div>
                <div className="font-medium text-cream text-sm">{point.label}</div>
                <div className="text-xs text-cream/55 mt-1 leading-relaxed">{point.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-2 text-center">
          <p className="label-eyebrow text-gold-deep mb-2">Quality Assurance</p>
          <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink">
            Verified at every step
          </h2>
        </div>
        <QualityBadges variant="light" />
        <div className="max-w-6xl mx-auto px-4 pb-4 text-center">
          <Link
            href="/quality-assurance"
            className="label-eyebrow text-[0.7rem] text-ink-soft hover:text-gold-deep transition-colors"
          >
            See how we verify what we sell &rarr;
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="label-eyebrow text-gold-deep mb-2">The Research Catalog</p>
            <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink">
              Browse by category
            </h2>
          </div>
          <Link
            href="/categories"
            className="label-eyebrow text-[0.68rem] text-ink-soft hover:text-gold-deep transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const count = products.filter((p) => p.category === category).length;
            return (
              <Link
                key={category}
                href={`/categories/${categorySlug(category)}`}
                className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-white pl-4 pr-3 py-2.5 hover:border-gold-deep hover:bg-cream-soft transition-colors"
              >
                <span className="font-medium text-ink text-sm group-hover:text-gold-deep transition-colors">
                  {category}
                </span>
                <span className="text-xs text-ink-soft bg-cream-soft group-hover:bg-white rounded-full px-2 py-0.5">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-cream-soft border-y border-line py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
              <div>
                <p className="label-eyebrow text-gold-deep mb-2">Current Lineup</p>
                <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink">
                  Featured compounds
                </h2>
              </div>
              <p className="text-sm text-ink-soft">
                Showing {featured.length} of {products.length} compounds
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 label-eyebrow text-[0.72rem] text-ink hover:text-gold-deep transition-colors"
              >
                View the full catalog
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 py-16">
        <p className="label-eyebrow text-gold-deep mb-2">Our Position</p>
        <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink mb-8 max-w-xl">
          Research transparency, not marketing claims
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languagePairs.map((pair) => (
            <div key={pair.wont} className="border border-line bg-white p-5">
              <p className="label-eyebrow text-[0.62rem] text-ink-soft/60 mb-2">
                We won&apos;t say
              </p>
              <p className="text-ink-soft text-sm line-through decoration-line/80 mb-4">
                {pair.wont}
              </p>
              <p className="label-eyebrow text-[0.62rem] text-gold-deep mb-2">We will say</p>
              <p className="text-ink text-sm leading-relaxed">{pair.will}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-cream-soft">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="label-eyebrow text-gold-deep mb-2">Questions</p>
          <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink mb-8">
            Frequently asked questions
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium text-ink mb-2">{faq.question}</dt>
                <dd className="text-ink-soft leading-relaxed text-sm">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />
    </div>
  );
}
