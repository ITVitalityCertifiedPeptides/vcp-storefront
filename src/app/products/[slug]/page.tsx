import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProductBySlug, categorySlug } from "@/lib/products";
import { productSchema, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import { productImages } from "@/lib/product-images";
import VialIcon from "@/components/VialIcon";
import RelatedProducts from "@/components/RelatedProducts";
import ProductFaq from "@/components/ProductFaq";
import AddToCartButton from "@/components/AddToCartButton";

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
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getAllProducts(),
  ]);
  if (!product) notFound();

  const image = productImages[product.slug];

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
    <>
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
        {/* Falls back to the drawn vial icon for any product without a real
            photo yet - see ProductCard.tsx for the same treatment used in
            listing grids. */}
        <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-dot-grid text-cream/[0.06]" aria-hidden />
              <VialIcon className="relative h-32 w-32 md:h-40 md:w-40 text-cream/25" />
            </>
          )}
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
                {product.inStock ? "In stock" : "Out of stock"}
              </dd>
            </div>
          </dl>

          <div className="mb-8">
            <AddToCartButton
              productId={product.id}
              inStock={product.inStock}
              size="lg"
            />
          </div>

          <div className="rounded-sm bg-cream-soft border border-line p-4 text-sm text-ink-soft mb-8 leading-relaxed">
            {product.ruoDisclaimer}
          </div>

          <p className="label-eyebrow text-[0.68rem] text-ink-soft">
            Certificate of Analysis included with every order. Verify your
            lot via the QR code on your packing slip and vial label.
          </p>
        </div>
      </div>
    </div>

      <ProductFaq productName={product.name} />
      <RelatedProducts current={product} products={allProducts} />
    </>
  );
}
