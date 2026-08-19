import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, FlaskConical, Package, Tag } from "lucide-react";
import {
  getAllCategories,
  getAllProducts,
  categorySlug,
  displayCategory,
} from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { faqSchema } from "@/lib/schema";
import FilteredProductGrid from "@/components/FilteredProductGrid";
import ProductCard from "@/components/ProductCard";
import QualityBadges from "@/components/QualityBadges";

export const metadata: Metadata = {
  title: `Research Peptides | ${siteConfig.name}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const BLEND_SLUGS = ["glow", "klow", "cjc-1295-ipamorelin"];

const benefits = [
  {
    icon: FlaskConical,
    label: "Third-Party Tested",
    detail: "Every lot verified by an independent lab, COA included.",
  },
  {
    icon: Package,
    label: "Made & Shipped in the USA",
    detail:
      "Synthesized in a US lab. Free shipping over $250, or over $75 on Scheduled Restock orders.",
  },
  {
    icon: Tag,
    label: "Direct Pricing, Every Day",
    detail: "The listed price is the price. No codes required.",
  },
];

// Kept strictly to policy/logistics questions - never anything framed as
// "what does this do" or dosing guidance, per the RUO compliance principle
// that governs every other page on this site.
const faqs = [
  {
    question: "Do you provide a Certificate of Analysis (COA)?",
    answer:
      "Yes. Every lot we carry has a lot-specific Certificate of Analysis. When your order ships you receive tracking and a digital copy of the COA for your exact lot.",
  },
  {
    question: "How is purity verified?",
    answer:
      "Each lot is third-party tested using HPLC and LC-MS, covering identity, purity, and net content. See our Quality Assurance page for the full process.",
  },
  {
    question: "Who can purchase from Vitality Certified Peptides?",
    answer:
      "Qualified researchers of every kind, including independent researchers. You do not need to represent a lab or institution; every purchase is for laboratory research use only.",
  },
  {
    question: "How do I find a compound's CAS number or category?",
    answer:
      "Every product page lists its CAS number and research category. You can also browse the full catalog by category.",
  },
  {
    question: "Do you offer free shipping?",
    answer:
      "Yes. US shipping is free on orders over $250, and on Scheduled Restock orders over $75. Below those, shipping is calculated when we confirm your order.",
  },
];

export default async function HomePage() {
  const categories = await getAllCategories();
  const products = await getAllProducts();
  const blends = products.filter((p) => BLEND_SLUGS.includes(p.slug));

  return (
    <div>
      {/* Full-bleed hero with separate desktop and mobile photography. */}
      <section className="relative bg-black text-cream overflow-hidden border-b border-line">
        <Image
          src="/hero-desktop.jpg"
          alt="Vitality Certified Peptides vials"
          fill
          sizes="100vw"
          className="object-cover object-right hidden sm:block"
          priority
        />
        <Image
          src="/hero-mobile.jpg"
          alt="Vitality Certified Peptides vials"
          fill
          sizes="100vw"
          className="object-cover object-center sm:hidden"
          priority
        />
        <div
          className="absolute inset-0 hidden sm:block bg-gradient-to-r from-black/90 via-black/55 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 sm:hidden bg-gradient-to-b from-black/85 via-black/40 to-transparent"
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          <h1 className="text-[2.4rem] md:text-[3.2rem] leading-[1.05] font-semibold tracking-tight max-w-xl">
            Direct pricing every day, for all of your research needs.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream/85">
            Third-party tested peptides, made in the USA, shipped within
            one business day. The listed price is the price.
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
              href="/quality-assurance"
              className="label-eyebrow text-[0.72rem] text-cream/80 hover:text-gold transition-colors underline decoration-cream/30 underline-offset-4"
            >
              How we test
            </Link>
          </div>
        </div>
      </section>

      {/* Benefit strip */}
      <section className="border-b border-line bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.label} className="flex items-start gap-3.5">
              <benefit.icon
                className="h-5 w-5 text-gold-deep shrink-0 mt-0.5"
                aria-hidden
              />
              <div>
                <div className="font-medium text-ink text-sm">{benefit.label}</div>
                <div className="text-xs text-ink-soft mt-1 leading-relaxed">
                  {benefit.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
              <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink">
                Shop peptides
              </h2>
              <Link
                href="/categories"
                className="label-eyebrow text-[0.68rem] text-ink-soft hover:text-gold-deep transition-colors"
              >
                Shop by research area &rarr;
              </Link>
            </div>
            <FilteredProductGrid products={products} />
          </div>
        </section>
      )}

      {blends.length > 0 && (
        <section className="bg-cream-soft border-y border-line py-14">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink">
                Research blends
              </h2>
              <p className="text-sm text-ink-soft mt-2 max-w-lg">
                Multi-compound blends, tested and documented the same way as
                every single compound we carry.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {blends.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 flex items-end justify-between mb-8 gap-4 flex-wrap">
          <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink">
            Shop by research area
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
              {displayCategory(category)}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-b border-line">
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-8 text-center">
          <h2 className="text-2xl md:text-[1.9rem] font-semibold text-ink">
            Quality Assured
          </h2>
        </div>
        <QualityBadges variant="light" />
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-12 text-center">
          <Link
            href="/quality-assurance"
            className="label-eyebrow text-[0.7rem] text-ink-soft hover:text-gold-deep transition-colors"
          >
            See how we verify what we sell &rarr;
          </Link>
        </div>
      </section>

      <section className="bg-cream-soft">
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
