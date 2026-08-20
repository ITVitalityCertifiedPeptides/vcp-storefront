import type { MetadataRoute } from "next";
import { getAllProducts, getAllCategories, categorySlug } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/categories`, changeFrequency: "weekly", priority: 0.9 },
    // /coa is intentionally omitted: it's QR-code-only access (order +
    // vial label), not a publicly linked or indexed page.
    { url: `${siteConfig.url}/quality-assurance`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/research`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/lab-results`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/ruo-policy`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/affiliates`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/support`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteConfig.url}/privacy-policy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteConfig.url}/terms-of-service`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteConfig.url}/refund-returns`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteConfig.url}/liability-waiver`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const [categories, products] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/categories/${categorySlug(category)}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/products/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
