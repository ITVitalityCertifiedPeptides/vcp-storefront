import Image from "next/image";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import {
  getAllProducts,
  filterVisible,
  getAllCategories,
  categorySlug,
  displayCategory,
} from "@/lib/products";
import { structuralClassFor } from "@/lib/structural-class";
import { productImages } from "@/lib/product-images";
import { isApprovedResearcher } from "@/lib/current-session";
import CartButton from "./CartButton";
import HeaderSearch from "./HeaderSearch";

const LEGAL_LINKS: [string, string][] = [
  ["/ruo-policy", "RUO Policy"],
  ["/privacy-policy", "Privacy Policy"],
  ["/liability-waiver", "Liability Waiver"],
  ["/refund-returns", "Refund and Returns"],
  ["/terms-of-service", "Terms of Service"],
  ["/support", "Support Center"],
];

function Wordmark() {
  return (
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
  );
}

function LegalDropdown() {
  return (
    <div className="relative group">
      <span className="inline-flex items-center gap-1.5 label-eyebrow text-[0.7rem] text-ink-soft group-hover:text-gold-deep transition-colors cursor-default py-3">
        Legal
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </span>
      <div className="absolute left-0 top-full hidden group-hover:block bg-white border border-line shadow-[0_12px_32px_-16px_rgba(21,19,15,0.35)] min-w-[220px] py-2 z-50">
        {LEGAL_LINKS.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="block px-5 py-2.5 text-sm text-ink hover:bg-cream-soft hover:text-gold-deep transition-colors whitespace-nowrap"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Categories dropdown (2026-08-30, Josh): brought back into the nav so
// visitors can browse by research area again, alongside (not instead of)
// the direct "Shop Catalog" link into the full grid. Same CSS-only
// hover-dropdown pattern as LegalDropdown, so this stays a server
// component - categories come from the live catalog via
// getAllCategories(), which reuses the already-cached getAllProducts()
// call this component makes below, so no extra Swell request.
function CategoriesDropdown({ categories }: { categories: string[] }) {
  return (
    <div className="relative group">
      <span className="inline-flex items-center gap-1.5 label-eyebrow text-[0.7rem] text-ink-soft group-hover:text-gold-deep transition-colors cursor-default py-3">
        Categories
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
        <div className="border-t border-line mt-2 pt-2">
          <Link
            href="/categories"
            className="block px-5 py-2.5 text-sm text-gold-deep hover:bg-cream-soft transition-colors whitespace-nowrap"
          >
            View all categories
          </Link>
        </div>
      </div>
    </div>
  );
}

// Researcher-gate (2026-08-28, revised per Josh): the catalog itself -
// categories, product names, the header search - is public, so this is
// one header for everyone. What changes with approval status is only the
// right-hand actions (Sign In/Register vs. Account/Cart) and the header
// search results: an unapproved visitor's search index has no price on
// it and never includes a "Researcher Only" product (see filterVisible()
// in catalog-shared.ts). middleware.ts is what actually blocks /cart and
// /checkout for anyone not approved.
export default async function SiteHeader() {
  const approved = await isApprovedResearcher();

  const allProducts = await getAllProducts();
  const products = filterVisible(allProducts, approved);
  const categories = await getAllCategories();
  // Lightweight index for the header's live-search dropdown: getAllProducts()
  // is cached per server process, so this doesn't add a second Swell call.
  //
  // 2026-08-29 (Josh): shop-facing surfaces, including search results,
  // show structural class rather than research-area naming - see
  // structural-class.ts. Research-area naming now lives only on the
  // Research Library page (/research).
  const searchIndex = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    category: structuralClassFor(product.name),
    price: approved ? (product.priceFrom ?? product.price) : null,
    image: product.images?.[0] || productImages[product.slug] || null,
  }));

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink text-center py-2 px-4">
        <p className="label-eyebrow text-[0.66rem] tracking-[0.16em] text-gold">
          Most orders ship within 1-3 business days
          <span className="text-cream/40 mx-2">&#8226;</span>
          Free US shipping over $250
          <span className="text-cream/40 mx-2 hidden sm:inline">&#8226;</span>
          <span className="hidden sm:inline">Restock orders over $75</span>
        </p>
      </div>
      <div className="bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          {/* 2026-08-29 (Josh): search moved next to the wordmark so it's
              the first thing visible, on every breakpoint, instead of
              being buried at the end of the right-hand action cluster.
              2026-08-30 (Josh): "Shop Catalog" now sits right beside the
              search bar too, so both ways into the catalog (search for
              something specific, or browse the full grid) are together
              up front - it's no longer stranded in the right-hand action
              cluster. Kept hidden below sm: the mobile full-width Shop
              Catalog row further down still covers narrow screens. */}
          <div className="flex items-center gap-3 md:gap-5 min-w-0">
            <Wordmark />
            <HeaderSearch products={searchIndex} />
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center rounded-full bg-ink text-cream px-5 py-2.5 label-eyebrow text-[0.68rem] hover:bg-gold-deep transition-colors whitespace-nowrap shrink-0"
            >
              Shop Catalog
            </Link>
          </div>
          {/* 2026-08-30 (Josh): Categories dropdown is back, alongside the
              direct Shop Catalog entry point above rather than replacing
              it - browsing by research area is a real path in again, not
              just search-or-full-grid. CSS-only hover dropdown (like
              Legal) so this stays a server component. */}
          <nav className="hidden lg:flex items-center gap-4">
            <CategoriesDropdown categories={categories} />
            <Link
              href="/quality-assurance"
              className="label-eyebrow text-[0.7rem] text-ink-soft hover:text-gold-deep transition-colors whitespace-nowrap"
            >
              Quality
            </Link>
            <Link
              href="/about"
              className="label-eyebrow text-[0.7rem] text-ink-soft hover:text-gold-deep transition-colors whitespace-nowrap"
            >
              About
            </Link>
            <Link
              href="/research"
              className="label-eyebrow text-[0.7rem] text-ink-soft hover:text-gold-deep transition-colors whitespace-nowrap"
            >
              Research
            </Link>
            <LegalDropdown />
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            {approved ? (
              <>
                <Link
                  href="/account"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-line bg-white text-ink hover:border-gold-deep hover:text-gold-deep transition-colors"
                  aria-label="Account"
                >
                  <User className="h-4.5 w-4.5" aria-hidden />
                </Link>
                <CartButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="label-eyebrow text-[0.7rem] text-ink-soft hover:text-gold-deep transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-full bg-ink text-cream px-5 py-2.5 label-eyebrow text-[0.68rem] hover:bg-gold-deep transition-colors whitespace-nowrap"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
        {/* 2026-08-29 (Josh): this used to be a row of category chips
            (pick a research area first) - since the desktop "Shop
            Catalog" button is also hidden below this breakpoint, it's
            replaced with the same single Shop Catalog link so mobile
            visitors still have a one-tap way straight into the catalog,
            no category step. 2026-08-30: also add a "Browse Categories"
            link beside it on mobile, since the Categories dropdown above
            is desktop-only (lg:flex). */}
        <div className="lg:hidden max-w-6xl mx-auto px-4 pb-3 flex items-center gap-3">
          <Link
            href="/shop"
            className="sm:hidden inline-flex items-center rounded-full bg-ink text-cream px-5 py-2 label-eyebrow text-[0.68rem] hover:bg-gold-deep transition-colors"
          >
            Shop Catalog
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center rounded-full border border-line bg-white text-ink px-5 py-2 label-eyebrow text-[0.68rem] hover:border-gold-deep hover:text-gold-deep transition-colors"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </header>
  );
}
