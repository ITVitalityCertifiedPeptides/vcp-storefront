import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getProductsByCategory,
  categoryFromSlug,
  categorySlug,
  filterVisible,
} from "@/lib/products";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import { isApprovedResearcher } from "@/lib/current-session";
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

  const title = `${category} Research Compounds`;
  const description = `Research-grade ${category.toLowerCase()} compounds for laboratory research use only, each with a lot-specific Certificate of Analysis.`;

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

  const approved = await isApprovedResearcher();
  const products = filterVisible(await getProductsByCategory(category), approved);
  const jsonLd = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Categories", url: `${siteConfig.url}/categories` },
    { name: category, url: `${siteConfig.url}/categories/${slug}` },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="label-eyebrow text-[0.68rem] text-ink-soft mb-5">
        <Link href="/categories" className="hover:text-gold-deep transition-colors">
          Categories
        </Link>{" "}
        <span className="text-line mx-1">/</span>{" "}
        <span className="text-ink">{category}</span>
      </nav>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">{category}</h1>
      <p className="text-ink-soft mb-10 max-w-2xl">
        {products.length} compound{products.length === 1 ? "" : "s"} in this
        research category. For laboratory research use only.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} approved={approved} />
        ))}
      </div>
    </div>
  );
}
