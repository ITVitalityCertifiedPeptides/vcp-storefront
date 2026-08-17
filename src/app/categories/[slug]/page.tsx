import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getProductsByCategory,
  categoryFromSlug,
  categorySlug,
  displayCategory,
} from "@/lib/products";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import ProductCard from "@/components/ProductCard";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    slug: categorySlug(category),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await categoryFromSlug(slug);
  if (!category) return {};

  const title = `${displayCategory(category)} Compounds`;
  const description = `Research-grade compounds in ${displayCategory(
    category
  ).toLowerCase()}, for laboratory research use only, each with a lot-specific Certificate of Analysis.`;

  return {
    title,
    description,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await categoryFromSlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category);
  const jsonLd = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Research Areas", url: `${siteConfig.url}/categories` },
    {
      name: displayCategory(category),
      url: `${siteConfig.url}/categories/${slug}`,
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="label-eyebrow text-[0.68rem] text-ink-soft mb-5">
        <Link href="/categories" className="hover:text-gold-deep transition-colors">
          Research Areas
        </Link>{" "}
        <span className="text-line mx-1">/</span>{" "}
        <span className="text-ink">{displayCategory(category)}</span>
      </nav>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">
        {displayCategory(category)}
      </h1>
      <p className="text-ink-soft mb-10 max-w-2xl">
        {products.length} compound{products.length === 1 ? "" : "s"} in this
        research area. For laboratory research use only.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
