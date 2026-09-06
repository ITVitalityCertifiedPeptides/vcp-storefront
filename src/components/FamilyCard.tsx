import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog-shared";
import type { ProductFamily } from "@/lib/product-families";
import { structuralClassFor } from "@/lib/structural-class";
import { productImages } from "@/lib/product-images";
import QuickAdd from "./QuickAdd";

// Shop tile for a product FAMILY (lib/product-families.ts): one tile per
// compound-and-form, e.g. "BPC-157" instead of BPC-157 5mg / 10mg / 15mg /
// 20mg as four tiles. Shows the generic no-size photo when Josh has
// dropped one in (public/products/<family>-generic.*), otherwise the
// primary size's photo. Multi-size families link to the cheapest
// purchasable size's page, where the size picker takes over; single-size
// families behave exactly like the old ProductCard, Quick Add included.
export default function FamilyCard({ family }: { family: ProductFamily<Product> }) {
  const p = family.primary;
  const multi = family.products.length > 1;
  const image =
    family.products.map((m) => m.familyImage).find(Boolean) ??
    p.images?.[0] ??
    productImages[p.slug] ??
    "/products/photo-coming-soon.png";
  const from = family.priceFrom;
  const range = from != null && family.priceMax != null && family.priceMax !== from;
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group block bg-white border border-line hover:border-gold-deep hover:shadow-[0_8px_24px_-12px_rgba(21,19,15,0.25)] transition-all"
    >
      <div className="relative aspect-[2/3] bg-black flex items-center justify-center overflow-hidden">
        <Image
          src={image}
          alt={family.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain"
        />
        {p.madeInUsa && (
          <span className="absolute top-1 right-1 border border-gold/50 text-gold text-[0.58rem] font-semibold uppercase tracking-wide px-2 py-1">
            Made in USA
          </span>
        )}
        {!family.inStock && (
          <span className="absolute top-1 left-1 bg-ink/80 text-cream/90 text-[0.6rem] font-semibold uppercase tracking-wide px-2 py-1">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-5">
        {p.category && (
          <p className="label-eyebrow text-gold-deep text-[0.65rem] mb-1.5">
            {structuralClassFor(p.name)}
          </p>
        )}
        <div className="font-medium text-[1.05rem] text-ink group-hover:text-gold-deep transition-colors">
          {family.name}
        </div>
        {/* Sizes line for multi-size families; CAS for singles. Both are
            one line so the price bar sits at the same height across the
            row (2026-09-05 rule). */}
        <div className="text-xs text-ink-soft mt-1 font-mono truncate">
          {family.forms.length > 1
            ? family.forms.join(" · ")
            : multi
              ? family.sizes.join(" · ")
              : `CAS ${p.casNumber || "N/A"}`}
        </div>
        {from != null && (
          <div className="mt-4 pt-3 border-t border-line">
            <div className="flex items-center justify-between">
              <span className="text-ink font-semibold">
                {range || (!multi && p.priceFrom != null) ? `From $${from.toFixed(2)}` : `$${from.toFixed(2)}`}
              </span>
              {multi || p.options.length > 0 ? (
                <span className="inline-flex items-center justify-center rounded-full px-3.5 py-1.5 label-eyebrow text-[0.6rem] bg-gold-deep text-cream group-hover:bg-ink transition-colors">
                  {family.forms.length > 1
                    ? `${family.forms.length} Forms`
                    : multi
                      ? `${family.products.length} Sizes`
                      : "Select Options"}
                </span>
              ) : (
                <QuickAdd productId={p.id} inStock={p.inStock} />
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
