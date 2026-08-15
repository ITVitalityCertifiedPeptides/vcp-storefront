import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProductBySlug, categorySlug } from "@/lib/products";
import { productSchema, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  // Researchers frequently search by CAS number rather than product name,
  // so working it into the <title> (when we have one) targets that intent
  // directly instead of relying only on on-page text.
  const title = product.casNumber
    ? `${product.name} (CAS ${product.casNumber})`
    : product.name;
  const description =
    product.description ||
    `${product.name} research compound${
      product.category ? ` in the ${product.category} category` : ""
    }. Research use only (RUO). Certificate of Analysis available for every lot.`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <nav className="label-eyebrow text-[0.68rem] text-ink-soft mb-6">
        <Link href="/categories" className="hover:text-gold-deep transition-colors">
          Categories
        </Link>{" "}
        <span className="text-line mx-1">/</span>{" "}
        <Link
          href={`/categories/${categorySlug(product.category)}`}
          className="hover:text-gold-deep transition-colors"
        >
          {product.category}
        </Link>{" "}
        <span className="text-line mx-1">/</span> <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        {/* Product photography isn't shot yet - see ProductCard.tsx for the
            same placeholder treatment used in listing grids. */}
        <div className="relative aspect-square bg-ink rounded-sm flex items-center justify-center overflow-hidden">
          <Image
            src="/emblem-512.png"
            alt=""
            width={220}
            height={220}
            className="h-32 w-32 md:h-44 md:w-44 opacity-25 grayscale"
          />
          <span className="absolute top-4 left-4 label-eyebrow text-[0.65rem] text-cream/70 border border-cream/25 rounded-sm px-2 py-0.5">
            RUO
          </span>
        </div>

        <div>
          {product.category && (
            <p className="label-eyebrow text-gold-deep mb-2">{product.category}</p>
          )}
          <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-4">
            {product.name}
          </h1>
          <p className="text-ink-soft leading-relaxed mb-8">{product.description}</p>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 text-sm border-y border-line py-5">
            <div>
              <dt className="label-eyebrow text-[0.62rem] text-ink-soft mb-1">CAS Number</dt>
              <dd className="font-medium text-ink">{product.casNumber || "N/A"}</dd>
            </div>
            <div>
              <dt className="label-eyebrow text-[0.62rem] text-ink-soft mb-1">Category</dt>
              <dd className="font-medium text-ink">{product.category}</dd>
            </div>
            {product.price != null && (
              <div>
                <dt className="label-eyebrow text-[0.62rem] text-ink-soft mb-1">Price</dt>
                <dd className="font-serif-display text-lg text-ink">
                  ${product.price.toFixed(2)}
                </dd>
              </div>
            )}
            <div>
              <dt className="label-eyebrow text-[0.62rem] text-ink-soft mb-1">Availability</dt>
              <dd className="font-medium text-ink flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    product.inStock ? "bg-gold" : "bg-ink-soft/40"
                  }`}
                  aria-hidden
                />
                {product.inStock ? "In stock" : "Available to order"}
              </dd>
            </div>
          </dl>

          <div className="rounded-sm bg-cream-soft border border-line p-4 text-sm text-ink-soft mb-8 leading-relaxed">
            {product.ruoDisclaimer}
          </div>

          <Link
            href="/coa"
            className="label-eyebrow text-[0.72rem] text-ink hover:text-gold-deep transition-colors underline underline-offset-4 decoration-line"
          >
            View Certificate of Analysis policy
          </Link>
        </div>
      </div>
    </div>
  );
}
