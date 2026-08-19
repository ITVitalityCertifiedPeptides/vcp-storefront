"use client";

// Multi-image product gallery: main image with a thumbnail strip.
// The image list is discovered server-side (see products/[slug]/page.tsx)
// from files in public/products following the naming convention:
//   <slug>-hero.jpg      hero shot (formula card background, vial foreground)
//   <slug>.jpg           label/blend shot (existing images)
//   <slug>-molecule.jpg  molecular structure card
//   <slug>-vial.jpg      plain vial shot
// Drop the files in and they appear on the next deploy; no code changes.

import { useState } from "react";
import Image from "next/image";
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
    <span className="absolute top-4 left-4 border border-gold/50 text-gold text-[0.6rem] font-semibold uppercase tracking-wide px-2 py-1 z-10">
      Made in USA
    </span>
  ) : null;

  if (images.length === 0) {
    return (
      <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid text-cream/[0.06]" aria-hidden />
        <VialIcon className="relative h-32 w-32 md:h-40 md:w-40 text-cream/25" />
        {badge}
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden">
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
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${name}`}
              className={`relative aspect-square bg-black overflow-hidden border transition-colors ${
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
