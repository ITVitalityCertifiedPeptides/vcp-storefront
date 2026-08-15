import Link from "next/link";
import { getAllCategories, categorySlug } from "@/lib/products";
import { siteConfig, ruoNotice } from "@/lib/site";

export default function SiteFooter() {
  const categories = getAllCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-semibold mb-2">{siteConfig.name}</div>
          <p className="text-neutral-600">{siteConfig.description}</p>
        </div>
        <div>
          <div className="font-medium mb-2">Categories</div>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/categories/${categorySlug(category)}`}
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-medium mb-2">Trust &amp; Compliance</div>
          <ul className="space-y-1">
            <li>
              <Link href="/coa" className="text-neutral-600 hover:text-neutral-900">
                Certificates of Analysis
              </Link>
            </li>
            <li>
              <Link href="/ruo-policy" className="text-neutral-600 hover:text-neutral-900">
                RUO Policy
              </Link>
            </li>
            <li>
              <Link href="/affiliates" className="text-neutral-600 hover:text-neutral-900">
                Affiliate Program
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-2">Research Use Only</div>
          <p className="text-neutral-500 text-xs leading-relaxed">{ruoNotice}</p>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">
        &copy; {year} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
