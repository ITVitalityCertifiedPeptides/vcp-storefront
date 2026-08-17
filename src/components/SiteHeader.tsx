import Image from "next/image";
import Link from "next/link";
import { getAllCategories, categorySlug } from "@/lib/products";

export default async function SiteHeader() {
  const categories = await getAllCategories();

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink text-cream text-center py-2 px-4">
        <p className="label-eyebrow text-[0.68rem] tracking-[0.18em] text-cream/90">
          Research Use Only <span className="text-gold mx-1.5">&#8226;</span>{" "}
          Not for human or veterinary use
        </p>
      </div>
      <div className="bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80 border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/emblem-512.png"
              alt=""
              width={44}
              height={44}
              className="h-10 w-10 md:h-11 md:w-11"
              priority
            />
            <span className="leading-none">
              <span className="block font-serif-display text-lg md:text-xl tracking-wide text-ink">
                Vitality
              </span>
              <span className="block label-eyebrow text-[0.6rem] tracking-[0.2em] text-gold-deep mt-0.5">
                Certified Peptides
              </span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-5">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category}
                href={`/categories/${categorySlug(category)}`}
                className="label-eyebrow text-[0.68rem] text-ink-soft hover:text-gold-deep transition-colors whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-5 shrink-0">
            <Link
              href="/categories"
              className="inline-flex items-center rounded-full bg-ink text-cream px-5 py-2.5 label-eyebrow text-[0.68rem] hover:bg-gold-deep transition-colors"
            >
              Shop Catalog
            </Link>
          </div>
        </div>
        {/* Compact category row for smaller viewports, since the primary
            nav above hides below lg. */}
        <div className="lg:hidden max-w-6xl mx-auto px-4 pb-3 flex items-center gap-4 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/categories/${categorySlug(category)}`}
              className="label-eyebrow text-[0.68rem] text-ink-soft hover:text-gold-deep whitespace-nowrap"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
