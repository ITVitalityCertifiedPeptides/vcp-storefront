import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getAllCategories, getAllProducts, categorySlug } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { faqSchema } from "@/lib/schema";
import ProductCard from "@/components/ProductCard";
import QualityBadges from "@/components/QualityBadges";

export const metadata: Metadata = {
  title: `Research Peptides | ${siteConfig.name}`,
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
  // In-stock items lead, everything else follows.
  const featured = [...products]
    .sort((a, b) => Number(b.inStock) - Number(a.inStock))
    .slice(0, 9);

  return (
    <div>
      {/* Full-bleed hero: the photo runs edge to edge with the copy
          overlaid on the dark left side of the composition. */}
      <section className="relative bg-black text-cream overflow-hidden border-b border-line">
        <Image
          src="/hero-desktop.jpg"
          alt="Vitality Certified Peptides vials"
          fill
          sizes="100vw"
          className="object-cover object-right"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent"
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          <h1 className="text-[2.4rem] md:text-[3.2rem] leading-[1.05] font-semibold tracking-tight max-w-xl">
            We sell peptides.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream/85">
            Research-grade compounds supplied to laboratory researchers,
            in stock and ready to ship.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-full bg-gold text-ink px-7 py-3.5 label-eyebrow text-[0.72rem] hover:bg-cream transition-colors"
            >
              Shop Peptides
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link
              href="/ruo-policy"
              className="label-eyebrow text-[0.72rem] text-cream/80 hover:text-gold transition-colors underline decoration-cream/30 underline-offset-4"
            >
              Read our Research Use Only policy
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
              <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink">
                Shop peptides
              </h2>
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
          {categories.map((category) => (
            <Link
              key={category}
              href={`/categories/${categorySlug(category)}`}
              className="inline-flex items-center rounded-full border border-line bg-white px-4 py-2.5 font-medium text-ink text-sm hover:border-gold-deep hover:text-gold-deep transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-b border-line">
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-0 text-center">
          <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink">
            Quality assured
          </h2>
        </div>
        <QualityBadges variant="light" />
        <div className="max-w-6xl mx-auto px-4 pb-6 -mt-2 text-center">
          <Link
            href="/quality-assurance"
            className="label-eyebrow text-[0.7rem] text-ink-soft hover:text-gold-deep transition-colors"
          >
            See how we verify what we sell &rarr;
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
