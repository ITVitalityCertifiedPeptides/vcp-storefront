import { readdirSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllProducts,
  getProductBySlug,
  categorySlug,
  displayCategory,
} from "@/lib/products";
import { productSchema, breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import { productImages } from "@/lib/product-images";
import { technicalDataFor, componentDataFor } from "@/lib/technical-data";
import ProductGallery from "@/components/ProductGallery";
import RelatedProducts from "@/components/RelatedProducts";
import ProductFaq from "@/components/ProductFaq";
import BuyBox from "@/components/BuyBox";

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

// Gallery discovery: files in public/products named by convention
// (<slug>-hero, <slug>, <slug>-molecule, <slug>-vial in .jpg/.png/.webp)
// appear automatically in that order. Drop images in, redeploy, done.
function galleryImages(slug: string): string[] {
  let files: string[] = [];
  try {
    files = readdirSync(join(process.cwd(), "public", "products"));
  } catch {
    // public/products missing in some build contexts; fall through.
  }
  const lower = new Map(files.map((f) => [f.toLowerCase(), f]));
  const bases = [`${slug}-hero`, slug, `${slug}-molecule`, `${slug}-vial`];
  const found: string[] = [];
  for (const base of bases) {
    for (const ext of ["jpg", "png", "webp"]) {
      const hit = lower.get(`${base.toLowerCase()}.${ext}`);
      if (hit) {
        found.push(`/products/${hit}`);
        break;
      }
    }
  }
  // Fallback to the static map for any legacy filename mismatch.
  if (found.length === 0 && productImages[slug]) found.push(productImages[slug]);
  return found;
}

// Lot testing documents from the COA repository (public/coas), named
// <slug>--<batch>.pdf. Josh uploads our own testing sheets there; newest
// first by filename sort.
function coaDocs(slug: string): string[] {
  let files: string[] = [];
  try {
    files = readdirSync(join(process.cwd(), "public", "coas"));
  } catch {
    return [];
  }
  return files
    .filter(
      (f) =>
        f.toLowerCase().startsWith(`${slug.toLowerCase()}--`) &&
        f.toLowerCase().endsWith(".pdf")
    )
    .sort()
    .reverse()
    .map((f) => `/coas/${f}`);
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

  const images = galleryImages(product.slug);
  const coas = coaDocs(product.slug);
  const tech = technicalDataFor(product.name);
  const isLiquid = product.name.toLowerCase().includes("bacteriostatic");

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
          {displayCategory(product.category)}
        </Link>{" "}
        <span className="text-line mx-1">/</span> <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        <ProductGallery
          images={images}
          name={product.name}
          madeInUsa={product.madeInUsa}
        />

        <div>
          {product.category && (
            <p className="label-eyebrow text-gold-deep mb-2">
              {displayCategory(product.category)}
            </p>
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
              <dt className="label-eyebrow text-[0.62rem] text-ink-soft mb-1">
                Research Area
              </dt>
              <dd className="font-medium text-ink">
                {displayCategory(product.category)}
              </dd>
            </div>
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

          <BuyBox
            product={{
              id: product.id,
              price: product.price,
              inStock: product.inStock,
              options: product.options,
              subscription: product.subscription,
            }}
          />

          <p className="label-eyebrow text-[0.68rem] text-ink-soft mb-3">
            When your order ships you receive tracking and a digital copy
            of the Certificate of Analysis for your lot.
          </p>
          {product.ruoDisclaimer && (
            <p className="text-xs text-ink-soft/70">{product.ruoDisclaimer}</p>
          )}
        </div>
      </div>

      {/* Technical Information: verified chemical data (see technical-data.ts)
          plus physical specifications. Nothing here is a use claim. */}
      <section className="mt-14 border-t border-line pt-10">
        <h2 className="font-serif-display text-2xl text-ink mb-6">
          Technical Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <dl className="text-sm space-y-4">
            <div className="grid grid-cols-[9rem_1fr] gap-3">
              <dt className="label-eyebrow text-[0.62rem] text-ink-soft pt-0.5">CAS Number</dt>
              <dd className="font-medium text-ink font-mono text-[0.82rem]">{product.casNumber || "N/A"}</dd>
            </div>
            {tech?.formula && (
              <div className="grid grid-cols-[9rem_1fr] gap-3">
                <dt className="label-eyebrow text-[0.62rem] text-ink-soft pt-0.5">Molecular Formula</dt>
                <dd className="font-medium text-ink font-mono text-[0.82rem]">{tech.formula}</dd>
              </div>
            )}
            {tech?.molarMass && (
              <div className="grid grid-cols-[9rem_1fr] gap-3">
                <dt className="label-eyebrow text-[0.62rem] text-ink-soft pt-0.5">Molar Mass</dt>
                <dd className="font-medium text-ink">{tech.molarMass}</dd>
              </div>
            )}
            {tech?.sequence && (
              <div className="grid grid-cols-[9rem_1fr] gap-3">
                <dt className="label-eyebrow text-[0.62rem] text-ink-soft pt-0.5">Sequence</dt>
                <dd className="font-medium text-ink font-mono text-[0.78rem] break-all">{tech.sequence}</dd>
              </div>
            )}
            {tech?.synonyms && tech.synonyms.length > 0 && (
              <div className="grid grid-cols-[9rem_1fr] gap-3">
                <dt className="label-eyebrow text-[0.62rem] text-ink-soft pt-0.5">Synonyms</dt>
                <dd className="text-ink">{tech.synonyms.join(", ")}</dd>
              </div>
            )}
            {tech?.components && (
              <div className="grid grid-cols-[9rem_1fr] gap-3">
                <dt className="label-eyebrow text-[0.62rem] text-ink-soft pt-0.5">Blend Components</dt>
                <dd className="text-ink">
                  {tech.components.map((component) => {
                    const c = componentDataFor(component);
                    return (
                      <span key={component} className="block mb-1.5">
                        <span className="font-medium">{component}</span>
                        {c?.formula ? (
                          <span className="text-ink-soft font-mono text-[0.78rem]">
                            {" "}({c.formula}{c.molarMass ? `, ${c.molarMass}` : ""})
                          </span>
                        ) : null}
                      </span>
                    );
                  })}
                </dd>
              </div>
            )}
            {tech?.note && (
              <p className="text-xs text-ink-soft">{tech.note}</p>
            )}
          </dl>

          <div>
            <dl className="text-sm space-y-4 mb-8">
              <div className="grid grid-cols-[9rem_1fr] gap-3">
                <dt className="label-eyebrow text-[0.62rem] text-ink-soft pt-0.5">Form</dt>
                <dd className="font-medium text-ink">
                  {isLiquid ? "Sterile liquid" : "Lyophilized powder"}
                </dd>
              </div>
              <div className="grid grid-cols-[9rem_1fr] gap-3">
                <dt className="label-eyebrow text-[0.62rem] text-ink-soft pt-0.5">Container</dt>
                <dd className="font-medium text-ink">Sealed glass vial, flip-top cap</dd>
              </div>
              {!isLiquid && (
                <div className="grid grid-cols-[9rem_1fr] gap-3">
                  <dt className="label-eyebrow text-[0.62rem] text-ink-soft pt-0.5">State</dt>
                  <dd className="font-medium text-ink">Not reconstituted</dd>
                </div>
              )}
              <div className="grid grid-cols-[9rem_1fr] gap-3">
                <dt className="label-eyebrow text-[0.62rem] text-ink-soft pt-0.5">Purity</dt>
                <dd className="font-medium text-ink">
                  Verified per lot on the Certificate of Analysis
                </dd>
              </div>
            </dl>

            <h3 className="label-eyebrow text-[0.7rem] text-gold-deep mb-3">
              Batch Testing
            </h3>
            {coas.length > 0 ? (
              <ul className="space-y-2 mb-3">
                {coas.map((doc) => (
                  <li key={doc}>
                    <a
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gold-deep hover:underline underline-offset-4"
                    >
                      Testing document: {doc.split("/").pop()?.replace(".pdf", "").split("--")[1] || "lot report"}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="text-xs text-ink-soft leading-relaxed">
              Every lot is tested and documented. When your order ships you
              receive tracking and a digital copy of the Certificate of
              Analysis for your exact lot.
            </p>
          </div>
        </div>
      </section>
    </div>

      <ProductFaq productName={product.name} />
      <RelatedProducts current={product} products={allProducts} />
    </>
  );
}
