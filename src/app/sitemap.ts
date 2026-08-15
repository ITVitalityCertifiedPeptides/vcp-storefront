import type { MetadataRoute } from "next";
import { getAllProducts, getAllCategories, categorySlug } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/categories`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/coa`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/ruo-policy`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/affiliates`, changeFrequency: "monthly", priority: 0.4 },
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
