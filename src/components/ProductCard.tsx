import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

// Product photography isn't shot yet (Josh is generating it separately), so
// the image slot renders a consistent dark placeholder panel with the
// emblem watermark instead of leaving a blank box or faking a photo. Swap
// this for a real <Image src={product.image}> once photos exist - the rest
// of the card doesn't need to change.
export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-sm border border-line bg-white overflow-hidden hover:border-gold-deep transition-colors"
    >
      <div className="relative aspect-square bg-ink flex items-center justify-center overflow-hidden">
        <Image
          src="/emblem-512.png"
          alt=""
          width={96}
          height={96}
          className="h-16 w-16 md:h-20 md:w-20 opacity-25 grayscale group-hover:opacity-40 transition-opacity"
        />
        <span className="absolute top-3 left-3 label-eyebrow text-[0.62rem] text-cream/70 border border-cream/25 rounded-sm px-2 py-0.5">
          RUO
        </span>
        {!product.inStock && (
          <span className="absolute top-3 right-3 label-eyebrow text-[0.6rem] text-gold border border-gold/40 rounded-sm px-2 py-0.5">
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
        <div className="font-serif-display text-lg text-ink group-hover:text-gold-deep transition-colors">
          {product.name}
        </div>
        {product.casNumber && (
          <div className="text-xs text-ink-soft mt-1">CAS {product.casNumber}</div>
        )}
        {product.price != null && (
          <div className="text-ink font-medium mt-3">${product.price.toFixed(2)}</div>
        )}
      </div>
    </Link>
  );
}
