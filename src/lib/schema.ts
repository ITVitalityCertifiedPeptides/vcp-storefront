import { Product } from "./products";
import { siteConfig } from "./site";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function websiteSchema() {
  // No potentialAction/SearchAction here on purpose: the site has no
  // /search route. Advertising a sitelinks searchbox for a page that
  // 404s is exactly the kind of structured-data mismatch Search Console
  // flags as an error, so omit it until a real search page exists.
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Deliberately does NOT include AggregateRating, Review, or any health-claim
// oriented properties. This is a research-use compound, not a consumer good,
// and the GTM compliance principle prohibits benefit-claim framing anywhere
// public-facing, including structured data a search engine might surface as
// a rich result.
export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku || undefined,
    category: product.category,
    url: `${siteConfig.url}/products/${product.slug}`,
    additionalProperty: product.casNumber
      ? [
          {
            "@type": "PropertyValue",
            name: "CAS Number",
            value: product.casNumber,
          },
        ]
      : undefined,
    // Purely factual link to a public chemical database entry for this CAS
    // number - not a claim of any kind, just identity verification, which
    // is a standard, safe way to strengthen a product page's topical
    // authority signal for search engines.
    sameAs: product.casNumber
      ? [
          `https://commonchemistry.cas.org/results?q=${encodeURIComponent(
            product.casNumber.split(" ")[0]
          )}`,
        ]
      : undefined,
    offers: product.price
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          // 2026-09-01: native Swell backorder is on for the whole catalog,
          // so `product.inStock` (see lib/products.ts) is true for both
          // literal in-stock and backordered items - both are purchasable,
          // which is what the storefront now shows. Structured data can be
          // more precise than a boolean: schema.org has a dedicated
          // BackOrder value, and Google Merchant/rich-results treat it
          // differently from InStock, so use the raw stockStatus here
          // instead of collapsing to the same "InStock" for both.
          availability:
            product.stockStatus === "backorder"
              ? "https://schema.org/BackOrder"
              : product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          url: `${siteConfig.url}/products/${product.slug}`,
        }
      : undefined,
  };
}
