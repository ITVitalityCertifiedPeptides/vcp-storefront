import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories, getAllProducts, categorySlug } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { faqSchema } from "@/lib/schema";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Research-Grade Compounds, RUO`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const trustPoints = [
  {
    label: "Certificate of Analysis",
    detail: "Issued for every lot",
  },
  {
    label: "RUO Compliant",
    detail: "Research use only, always",
  },
  {
    label: "Qualified Researchers",
    detail: "Sold to labs & institutions",
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
      "Yes. A lot-specific Certificate of Analysis is required from our suppliers for every SKU we carry, provided prior to or accompanying shipment.",
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

export default async function HomePage() {
  const categories = await getAllCategories();
  const products = await getAllProducts();
  const featured = products.slice(0, 6);

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 pt-16 md:pt-20 pb-14">
        <p className="label-eyebrow text-gold-deep mb-5 flex items-center gap-2">
          <span className="h-px w-8 bg-gold" aria-hidden />
          Purity &middot; Potency &middot; Documentation
        </p>
        <h1 className="font-serif-display text-4xl md:text-5xl leading-[1.1] max-w-2xl text-ink">
          Research-grade compounds, backed by a{" "}
          <span className="italic text-gold-deep">Certificate of Analysis</span>{" "}
          on every lot.
        </h1>
        <p className="mt-5 text-ink-soft max-w-xl text-lg leading-relaxed">
          {siteConfig.name} supplies laboratory research use only (RUO)
          compounds for qualified research settings. Every product is sold
          strictly for research use, not for human or veterinary consumption.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/categories"
            className="inline-flex items-center rounded-sm bg-ink text-cream px-6 py-3 label-eyebrow text-[0.72rem] hover:bg-gold-deep transition-colors"
          >
            Browse Research Categories
          </Link>
          <Link
            href="/coa"
            className="inline-flex items-center rounded-sm border border-ink/20 px-6 py-3 label-eyebrow text-[0.72rem] text-ink hover:border-gold-deep hover:text-gold-deep transition-colors"
          >
            Certificates of Analysis
          </Link>
        </div>
        <p className="mt-6 text-xs text-ink-soft/80 label-eyebrow tracking-[0.12em]">
          For Laboratory Research Use Only. Not for human or veterinary use.
        </p>
      </section>

      <section className="border-y border-line bg-cream-soft">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {trustPoints.map((point) => (
            <div key={point.label} className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold shrink-0" aria-hidden />
              <div>
                <div className="font-medium text-ink">{point.label}</div>
                <div className="text-sm text-ink-soft">{point.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <p className="label-eyebrow text-gold-deep mb-2">The Research Catalog</p>
        <h2 className="font-serif-display text-2xl md:text-3xl text-ink mb-8">
          Research categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const count = products.filter((p) => p.category === category).length;
            return (
              <Link
                key={category}
                href={`/categories/${categorySlug(category)}`}
                className="group block rounded-sm border border-line bg-white p-5 hover:border-gold-deep transition-colors"
              >
                <div className="font-medium text-ink group-hover:text-gold-deep transition-colors">
                  {category}
                </div>
                <div className="text-sm text-ink-soft mt-1">
                  {count} compound{count === 1 ? "" : "s"}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-ink text-cream py-16">
          <div className="max-w-6xl mx-auto px-4">
            <p className="label-eyebrow text-gold mb-2">Current Lineup</p>
            <h2 className="font-serif-display text-2xl md:text-3xl mb-8">
              Featured compounds
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/categories"
                className="label-eyebrow text-[0.72rem] text-gold hover:text-cream transition-colors"
              >
                View the full catalog &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 py-16">
        <p className="label-eyebrow text-gold-deep mb-2">Our Position</p>
        <h2 className="font-serif-display text-2xl md:text-3xl text-ink mb-4 max-w-2xl">
          Research transparency, not marketing claims
        </h2>
        <p className="text-ink-soft max-w-2xl leading-relaxed">
          Every product page on this site describes what a compound has been
          studied or researched for in the scientific literature. We do not
          make claims about effects on the human body, and we do not publish
          dosing guidance for human use. Our trust position is built on
          Certificate of Analysis documentation for every lot, not on
          promotional language.
        </p>
      </section>

      <section className="border-t border-line bg-cream-soft">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <p className="label-eyebrow text-gold-deep mb-2">Questions</p>
          <h2 className="font-serif-display text-2xl md:text-3xl text-ink mb-8">
            Frequently asked questions
          </h2>
          <dl className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-b border-line pb-6 last:border-0 last:pb-0">
                <dt className="font-medium text-ink mb-2">{faq.question}</dt>
                <dd className="text-ink-soft leading-relaxed">{faq.answer}</dd>
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
