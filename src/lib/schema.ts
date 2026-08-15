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
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
    offers: product.price
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: product.active
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `${siteConfig.url}/products/${product.slug}`,
        }
      : undefined,
  };
}
