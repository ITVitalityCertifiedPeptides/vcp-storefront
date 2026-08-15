import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProductBySlug, categorySlug } from "@/lib/products";
import { productSchema, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = [
    productSchema(product),
    breadcrumbSchema([
      { name: "Home", url: siteConfig.url },
      { name: "Categories", url: `${siteConfig.url}/categories` },
      {
        name: product.category,
        url: `${siteConfig.url}/categories/${categorySlug(product.category)}`,
      },
      { name: product.name, url: `${siteConfig.url}/products/${product.slug}` },
    ]),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <nav className="text-sm text-neutral-500 mb-4">
        <Link href="/categories" className="hover:text-neutral-800">
          Categories
        </Link>{" "}
        /{" "}
        <Link
          href={`/categories/${categorySlug(product.category)}`}
          className="hover:text-neutral-800"
        >
          {product.category}
        </Link>{" "}
        / <span className="text-neutral-800">{product.name}</span>
      </nav>

      <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
      <p className="text-neutral-600 mb-6">{product.description}</p>

      <dl className="grid grid-cols-2 gap-4 max-w-md mb-8 text-sm border-y border-neutral-200 py-4">
        <div>
          <dt className="text-neutral-500">CAS Number</dt>
          <dd className="font-medium">{product.casNumber || "N/A"}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Category</dt>
          <dd className="font-medium">{product.category}</dd>
        </div>
        {product.price != null && (
          <div>
            <dt className="text-neutral-500">Price</dt>
            <dd className="font-medium">${product.price.toFixed(2)}</dd>
          </div>
        )}
        <div>
          <dt className="text-neutral-500">Availability</dt>
          <dd className="font-medium">
            {product.active ? "In stock" : "Unavailable"}
          </dd>
        </div>
      </dl>

      <div className="rounded-md bg-neutral-50 border border-neutral-200 p-4 text-sm text-neutral-600 mb-8">
        {product.ruoDisclaimer}
      </div>

      <Link
        href="/coa"
        className="text-sm font-medium text-neutral-900 underline underline-offset-4"
      >
        View Certificate of Analysis policy
      </Link>
    </div>
  );
}
