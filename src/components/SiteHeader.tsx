import Image from "next/image";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import { getAllProducts } from "@/lib/products";
import { structuralClassFor } from "@/lib/structural-class";
import { productImages } from "@/lib/product-images";
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

// 2026-08-31 (Josh): the researcher gate is gone from retail entirely -
// catalog, pricing, and purchasing are public to every visitor, no login
// required, no customer-group check anywhere in this header. Account/Cart
// render unconditionally now; /account itself handles "not signed in yet"
// (see app/account/page.tsx) rather than this header branching on it.
export default async function SiteHeader() {
  const products = await getAllProducts();
  // Lightweight index for the header's live-search dropdown: getAllProducts()
  // is cached per server process, so this doesn't add a second Swell call.
  //
  // 2026-08-29 (Josh): shop-facing surfaces, including search results,
  // show structural class rather than research-area naming - see
  // structural-class.ts. Research-area naming now lives only on the
  // Research Library page (/research).
  //
  // 2026-09-05 (GLP-1 login gate): GLP-1 products are ALWAYS left out of
  // this index, for signed-in and anonymous visitors alike - not
  // filtered by hasGlp1Access() the way /shop, categories, search, and
  // the homepage are. SiteHeader renders on every single page via the
  // root layout, so checking cookies() here would force the entire site
  // into per-request dynamic rendering, not just the handful of
  // catalog-listing pages that already accept that cost. A signed-in
  // visitor can still find and buy GLP-1 products via /shop, a category
  // page, /search, or a direct link - just not this quick dropdown.
  const searchIndex = products
    .filter((product) => !product.isGlp1)
    .map((product) => ({
      slug: product.slug,
      name: product.name,
      category: structuralClassFor(product.name),
      price: product.priceFrom ?? product.price,
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
          {/* 2026-08-30 (Josh, 2nd pass): the standalone Categories dropdown
              tried here didn't last the day - Josh wants browsing by
              research area to happen AS A FILTER ON THE SHOP PAGE itself
              (see FilteredProductGrid's category select), not as a second
              nav item next to Shop Catalog. So this nav is back to just
              the informational/legal links; Shop Catalog is still the one
              button that gets you into the catalog, and once you're there
              you filter by category, stock, etc. /categories and
              /categories/[slug] still exist unchanged for SEO/footer use. */}
          <nav className="hidden lg:flex items-center gap-4">
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
        {/* 2026-08-29 (Josh): this used to be a row of category chips
            (pick a research area first) - since the desktop "Shop
            Catalog" button is also hidden below this breakpoint, it's
            replaced with the same single Shop Catalog link so mobile
            visitors still have a one-tap way straight into the catalog,
            no category step. 2026-08-30 (Josh, 2nd pass): dropped the
            separate "Browse Categories" mobile button added earlier the
            same day, for the same reason as the desktop nav above -
            category browsing lives as a filter on /shop now. Also
            narrowed this row to sm:hidden (was lg:hidden): the desktop
            Shop Catalog button is already visible from sm up, so this
            row only needs to exist below sm - it used to render empty
            padding on tablet widths. */}
        <div className="sm:hidden max-w-6xl mx-auto px-4 pb-3">
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full bg-ink text-cream px-5 py-2 label-eyebrow text-[0.68rem] hover:bg-gold-deep transition-colors"
          >
            Shop Catalog
          </Link>
        </div>
      </div>
    </header>
  );
}
