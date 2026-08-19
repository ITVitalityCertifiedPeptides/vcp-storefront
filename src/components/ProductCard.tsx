import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog-shared";
import { displayCategory } from "@/lib/catalog-shared";
import { productImages } from "@/lib/product-images";
import VialIcon from "./VialIcon";
import QuickAdd from "./QuickAdd";

// Product card for the shop grids: the hero shot only, kept clean.
// Additional gallery images (molecule cards) live on the product page,
// browsable with arrows and the thumbnail strip.
export default function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0] || productImages[product.slug];
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white border border-line hover:border-gold-deep hover:shadow-[0_8px_24px_-12px_rgba(21,19,15,0.25)] transition-all"
    >
      {/* bg-black matches the near-black background of the product
          photography, so wider compositions letterbox invisibly instead
          of showing gray bars. */}
      <div className="relative aspect-[2/3] bg-black flex items-center justify-center overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain"
          />
        ) : (
          <VialIcon className="h-20 w-20 md:h-24 md:w-24 text-cream/20 group-hover:text-gold/40 transition-colors" />
        )}
        {product.madeInUsa && (
          <span className="absolute top-1 right-1 border border-gold/50 text-gold text-[0.58rem] font-semibold uppercase tracking-wide px-2 py-1">
            Made in USA
          </span>
        )}
        {/* Out of Stock sits on the left so it never collides with the
            Made in USA badge, which lives on the right. */}
        {!product.inStock && (
          <span className="absolute top-1 left-1 bg-ink/80 text-cream/90 text-[0.6rem] font-semibold uppercase tracking-wide px-2 py-1">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-5">
        {product.category && (
          <p className="label-eyebrow text-gold-deep text-[0.65rem] mb-1.5">
            {displayCategory(product.category)}
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
          <div className="mt-4 pt-3 border-t border-line">
            <div className="flex items-center justify-between">
              <span className="text-ink font-semibold">
                {product.priceFrom != null
                  ? `From $${product.priceFrom.toFixed(2)}`
                  : `$${product.price.toFixed(2)}`}
              </span>
              {product.options.length > 0 ? (
                <span className="inline-flex items-center justify-center rounded-full px-3.5 py-1.5 label-eyebrow text-[0.6rem] bg-gold-deep text-cream group-hover:bg-ink transition-colors">
                  Select Options
                </span>
              ) : (
                <QuickAdd
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  inStock={product.inStock}
                  plans={product.subscription}
                />
              )}
            </div>
            {product.subscription && (
              <p className="text-[0.7rem] text-gold-deep mt-2">
                Restock &amp; Save 10% with Autoship
              </p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
