import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// Re-fetch product/category data from Swell at most once per hour instead
// of only on a fresh deploy, so price/stock/copy edits made in the Swell
// admin show up on the live site without Josh needing to trigger a redeploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Research-Grade Compounds, RUO`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#15130f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = [organizationSchema(), websiteSchema()];

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
