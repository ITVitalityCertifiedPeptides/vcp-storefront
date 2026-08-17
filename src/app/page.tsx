import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { FlaskConical, ArrowRight } from "lucide-react";
import { getAllCategories, getAllProducts, categorySlug } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { faqSchema } from "@/lib/schema";
import ProductCard from "@/components/ProductCard";
import QualityBadges from "@/components/QualityBadges";

export const metadata: Metadata = {
  title: `Research Peptides, Third-Party Tested | ${siteConfig.name}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

// Kept strictly to policy/logistics questions - never anything framed as
// "what does this do" or dosing guidance, per the RUO compliance principle
// that governs every other page on this site.
const faqs = [
  {
    question: "Do you provide a Certificate of Analysis (COA)?",
    answer:
      "Yes. Every lot we carry has a lot-specific Certificate of Analysis. Scan the QR code on your order and vial label to pull up the COA for the exact lot you received.",
  },
  {
    question: "How is purity verified?",
    answer:
      "Each lot is third-party tested using HPLC and LC-MS, covering identity, purity, and net content. See our Quality Assurance page for the full process.",
  },
  {
    question: "Who can purchase from Vitality Certified Peptides?",
    answer:
      "Our products are sold to qualified researchers, laboratories, and institutions purchasing for research purposes only.",
  },
  {
    question: "How do I find a compound's CAS number or category?",
    answer:
      "Every product page lists its CAS number and research category. You can also browse the full catalog by category.",
  },
];

export default async function HomePage() {
  const categories = await getAllCategories();
  const products = await getAllProducts();
  // Lead with what's physically in stock (the current PO batch) rather
  // than whatever order the Swell API happens to return - in-stock items
  // first, everything else after.
  const featured = [...products]
    .sort((a, b) => Number(b.inStock) - Number(a.inStock))
    .slice(0, 9);

  return (
    <div>
      <section className="border-b border-line overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
          <div className="pt-10 md:pt-14 pb-10 lg:pr-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-deep/30 bg-gold-deep/5 px-3.5 py-1.5 label-eyebrow text-[0.66rem] text-gold-deep mb-6">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden />
              Third-Party Tested &middot; COA on Every Lot
            </span>
            <h1 className="text-[2.3rem] md:text-[2.9rem] leading-[1.05] font-semibold tracking-tight text-ink max-w-xl">
              Research-grade peptides,
              <br />
              verified pure.
            </h1>
            <p className="mt-5 text-ink-soft max-w-lg text-lg leading-relaxed">
              Every lot is independently tested for identity and purity, and
              ships with its own Certificate of Analysis. In stock and ready
              to ship.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-6">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-full bg-gold-deep text-cream px-7 py-3.5 label-eyebrow text-[0.72rem] hover:bg-ink transition-colors"
              >
                Shop Peptides
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                href="/quality-assurance"
                className="label-eyebrow text-[0.72rem] text-ink hover:text-gold-deep transition-colors underline decoration-line underline-offset-4"
              >
                How we test
              </Link>
            </div>
          </div>
          <div className="relative bg-ink text-cream min-h-[280px] lg:min-h-0 overflow-hidden">
            <Image
              src="/hero-desktop.jpg"
              alt="Vitality Certified Peptides research compound vials"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
              <div>
                <p className="label-eyebrow text-gold-deep mb-2">Shop</p>
                <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink">
                  In stock now
                </h2>
              </div>
              <Link
                href="/categories"
                className="label-eyebrow text-[0.68rem] text-ink-soft hover:text-gold-deep transition-colors"
              >
                View all {products.length} products &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 rounded-full bg-ink text-cream px-6 py-3 label-eyebrow text-[0.7rem] hover:bg-gold-deep transition-colors"
              >
                Shop the Full Catalog
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-cream-soft border-y border-line py-14">
        <div className="max-w-6xl mx-auto px-4 flex items-end justify-between mb-8 gap-4 flex-wrap">
          <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink">
            Shop by category
          </h2>
          <Link
            href="/categories"
            className="label-eyebrow text-[0.68rem] text-ink-soft hover:text-gold-deep transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-3">
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

      <section className="border-b border-line">
        <QualityBadges variant="light" />
        <div className="max-w-6xl mx-auto px-4 pb-6 -mt-2 text-center">
          <Link
            href="/quality-assurance"
            className="label-eyebrow text-[0.7rem] text-ink-soft hover:text-gold-deep transition-colors"
          >
            See how we verify every lot &rarr;
          </Link>
        </div>
      </section>

      <section className="bg-cream-soft border-t border-line">
        <div className="max-w-6xl mx-auto px-4 py-14">
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
