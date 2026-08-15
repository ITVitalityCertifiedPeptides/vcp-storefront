import Link from "next/link";
import type { Product } from "@/lib/products";
import VialIcon from "./VialIcon";

// Product photography isn't shot yet (Josh is generating it separately), so
// the image slot renders a drawn vial icon instead of a photo or a logo
// watermark. Swap the icon block for a real <Image src={product.image}>
// once photos exist - the rest of the card doesn't need to change.
export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white border border-line hover:border-gold-deep hover:shadow-[0_8px_24px_-12px_rgba(21,19,15,0.25)] transition-all"
    >
      <div className="relative aspect-square bg-ink flex items-center justify-center overflow-hidden">
        <VialIcon className="h-20 w-20 md:h-24 md:w-24 text-cream/20 group-hover:text-gold/40 transition-colors" />
        <span className="absolute top-3 left-3 label-eyebrow text-[0.6rem] text-cream/60">
          RUO
        </span>
        {!product.inStock && (
          <span className="absolute top-3 right-3 bg-gold-deep text-cream text-[0.6rem] font-semibold uppercase tracking-wide px-2 py-1">
            Order Only
          </span>
        )}
      </div>
      <div className="p-5">
        {product.category && (
          <p className="label-eyebrow text-gold-deep text-[0.65rem] mb-1.5">
            {product.category}
          </p>
        )}
        <div className="font-medium text-[1.05rem] text-ink group-hover:text-gold-deep transition-colors">
          {product.name}
        </div>
        {product.casNumber && (
          <div className="text-xs text-ink-soft mt-1 font-mono">
            CAS {product.casNumber}
          </div>
        )}
        {product.price != null && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-line">
            <span className="text-ink font-semibold">${product.price.toFixed(2)}</span>
            <span className="label-eyebrow text-[0.62rem] text-ink-soft group-hover:text-gold-deep transition-colors">
              View &rarr;
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
