"use client";

// Multi-image product gallery: main image with left/right arrows, an
// image counter, and a thumbnail strip. The image list is discovered
// server-side (see lib/product-gallery.ts) from files in public/products
// following the naming convention:
//   <slug>-hero.jpg      hero shot (formula card background, vial foreground)
//   <slug>.jpg           label/blend shot (existing images)
//   <slug>-molecule.jpg  molecular structure card
//   <slug>-vial.jpg      plain vial shot
// Blends additionally show one molecule card per component compound.
// Drop the files in and they appear on the next deploy; no code changes.

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({
  images,
  name,
  madeInUsa,
}: {
  images: string[];
  name: string;
  madeInUsa?: boolean;
}) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);

  // Touch swipe on the main image (phones). Horizontal drag past 40px
  // flips the image; a vertical drag is left alone so the page scrolls.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current || images.length < 2) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) next();
      else prev();
    }
  };

  const badge = madeInUsa ? (
    // Sits high in the corner so it clears the "RESEARCH USE ONLY" line
    // printed in the top right of the hero artwork itself.
    <span className="absolute top-1.5 right-1.5 border border-gold/50 text-gold text-[0.6rem] font-semibold uppercase tracking-wide px-2 py-1 z-10">
      Made in USA
    </span>
  ) : null;

  if (images.length === 0) {
    return (
      <div className="relative aspect-[2/3] bg-black flex items-center justify-center overflow-hidden">
        <Image
          src="/products/photo-coming-soon.png"
          alt={`${name} - photo coming soon`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
        />
        {badge}
      </div>
    );
  }

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-cream/90 hover:bg-gold-deep hover:text-cream transition-colors";

  return (
    <div>
      <div
        className="relative aspect-[2/3] bg-black flex items-center justify-center overflow-hidden group touch-pan-y select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${name}${active > 0 ? ` image ${active + 1}` : ""}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
          priority={active === 0}
        />
        {badge}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className={`${arrowClass} left-2`}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className={`${arrowClass} right-2`}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
            <span className="absolute bottom-2 right-2 z-10 rounded-full bg-black/50 text-cream/85 text-[0.62rem] font-medium px-2 py-0.5 tabular-nums">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x sm:grid sm:grid-cols-4 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${name}`}
              className={`relative aspect-[2/3] w-16 shrink-0 snap-start sm:w-auto bg-black overflow-hidden border transition-colors ${
                i === active
                  ? "border-gold-deep"
                  : "border-transparent hover:border-line"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
