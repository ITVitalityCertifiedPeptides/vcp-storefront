import Image from "next/image";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import { getAllCategories, categorySlug, displayCategory } from "@/lib/products";
import CartButton from "./CartButton";

export default async function SiteHeader() {
  const categories = await getAllCategories();

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink text-center py-2 px-4">
        <p className="label-eyebrow text-[0.66rem] tracking-[0.16em] text-gold">
          Free US shipping over $250
          <span className="text-cream/40 mx-2">&#8226;</span>
          Restock orders over $75
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
          {/* CSS-only hover dropdown so this stays a server component. */}
          <nav className="hidden lg:flex items-center gap-6">
            <div className="relative group">
              <span className="inline-flex items-center gap-1.5 label-eyebrow text-[0.7rem] text-ink-soft group-hover:text-gold-deep transition-colors cursor-default py-3">
                Research Areas
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-line shadow-[0_12px_32px_-16px_rgba(21,19,15,0.35)] min-w-[240px] py-2 z-50">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/categories/${categorySlug(category)}`}
                    className="block px-5 py-2.5 text-sm text-ink hover:bg-cream-soft hover:text-gold-deep transition-colors whitespace-nowrap"
                  >
                    {displayCategory(category)}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/quality-assurance"
              className="label-eyebrow text-[0.7rem] text-ink-soft hover:text-gold-deep transition-colors whitespace-nowrap"
            >
              Quality
            </Link>
          </nav>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/categories"
              className="hidden md:inline-flex items-center rounded-full bg-ink text-cream px-5 py-2.5 label-eyebrow text-[0.68rem] hover:bg-gold-deep transition-colors"
            >
              Shop Catalog
            </Link>
            <Link
              href="/account"
              className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-line bg-white text-ink hover:border-gold-deep hover:text-gold-deep transition-colors"
              aria-label="Account"
            >
              <User className="h-4.5 w-4.5" aria-hidden />
            </Link>
            <CartButton />
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
              {displayCategory(category)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
