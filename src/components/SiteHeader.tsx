import Link from "next/link";
import { getAllCategories, categorySlug } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export default async function SiteHeader() {
  const categories = await getAllCategories();

  return (
    <header className="border-b border-neutral-200">
      <div className="bg-neutral-900 text-white text-xs text-center py-1.5 px-4">
        Research Use Only. Not for human or veterinary use.
      </div>
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category}
              href={`/categories/${categorySlug(category)}`}
              className="text-neutral-600 hover:text-neutral-900"
            >
              {category}
            </Link>
          ))}
          <Link
            href="/coa"
            className="text-neutral-600 hover:text-neutral-900"
          >
            Certificates of Analysis
          </Link>
        </nav>
      </div>
    </header>
  );
}
