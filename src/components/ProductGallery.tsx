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

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VialIcon from "./VialIcon";

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
        <div className="absolute inset-0 bg-dot-grid text-cream/[0.06]" aria-hidden />
        <VialIcon className="relative h-32 w-32 md:h-40 md:w-40 text-cream/25" />
        {badge}
      </div>
    );
  }

  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);
  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-cream/90 hover:bg-gold-deep hover:text-cream transition-colors";

  return (
    <div>
      <div className="relative aspect-[2/3] bg-black flex items-center justify-center overflow-hidden group">
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
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${name}`}
              className={`relative aspect-[2/3] bg-black overflow-hidden border transition-colors ${
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
