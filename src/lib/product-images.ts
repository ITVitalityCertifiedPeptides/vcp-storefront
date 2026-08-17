// Real product photography keyed by product slug. Any product without a
// listed image falls back to the drawn VialIcon placeholder.
//
// Catalog structure: one product per compound (no size variants), per
// Josh's decision 2026-08-17. Additional per-size photo files exist in
// public/products/ (e.g. bpc-157-20mg.jpg) from an explored-and-rolled-
// back per-size restructure; they are unused and harmless.
export const productImages: Record<string, string> = {
  "bpc-157": "/products/bpc-157.jpg",
  "cjc-1295-ipamorelin": "/products/cjc-1295-ipamorelin.jpg",
  klow: "/products/klow.jpg",
  nadplus: "/products/nadplus.jpg",
  tirzepatide: "/products/tirzepatide.jpg",
  retatrutide: "/products/retatrutide.jpg",
  dsip: "/products/dsip.jpg",
  epitalon: "/products/epitalon.jpg",
  "ghk-cu": "/products/ghk-cu.jpg",
  "ghrp-6": "/products/ghrp-6.jpg",
  glow: "/products/glow.jpg",
  glutathione: "/products/glutathione.jpg",
  "igf-1-lr3": "/products/igf-1-lr3.jpg",
  kisspeptin: "/products/kisspeptin.jpg",
  kpv: "/products/kpv.jpg",
  "ll-37": "/products/ll-37.jpg",
  "melanotan-i": "/products/melanotan-i.jpg",
  "melanotan-ii": "/products/melanotan-ii.jpg",
  "mots-c": "/products/mots-c.jpg",
  "n-acetyl-selank-semax": "/products/n-acetyl-selank-semax.jpg",
  pinealon: "/products/pinealon.jpg",
  "pt-141": "/products/pt-141.jpg",
  semaglutide: "/products/semaglutide.jpg",
  sermorelin: "/products/sermorelin.jpg",
  "ss-31": "/products/ss-31.jpg",
  "tb-500": "/products/tb-500.jpg",
  tesamorelin: "/products/tesamorelin.jpg",
};
