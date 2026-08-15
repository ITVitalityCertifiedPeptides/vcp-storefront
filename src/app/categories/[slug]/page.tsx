import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getProductsByCategory,
  categoryFromSlug,
  categorySlug,
} from "@/lib/products";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({
    slug: categorySlug(category),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
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
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const products = getProductsByCategory(category);
  const jsonLd = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Categories", url: `${siteConfig.url}/categories` },
    { name: category, url: `${siteConfig.url}/categories/${slug}` },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-neutral-500 mb-4">
        <Link href="/categories" className="hover:text-neutral-800">
          Categories
        </Link>{" "}
        / <span className="text-neutral-800">{category}</span>
      </nav>
      <h1 className="text-2xl font-semibold mb-2">{category}</h1>
      <p className="text-neutral-600 mb-8 max-w-2xl">
        {products.length} compound{products.length === 1 ? "" : "s"} in this
        research category. For laboratory research use only.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="block rounded-lg border border-neutral-200 p-5 hover:border-neutral-400 transition-colors"
          >
            <div className="font-medium">{product.name}</div>
            {product.casNumber && (
              <div className="text-xs text-neutral-500 mt-1">
                CAS {product.casNumber}
              </div>
            )}
            {product.price != null && (
              <div className="text-sm text-neutral-700 mt-2">
                ${product.price.toFixed(2)}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
