// Real product photography lands here as it's generated, keyed by product
// slug. Not every product has a real photo yet - ProductCard and the
// product detail page fall back to the drawn VialIcon placeholder for any
// slug not listed below.
//
// IMPORTANT - size-on-label vs. site price is unresolved: the label
// artwork shows a specific size/dosage per vial (e.g. Tirzepatide 30mg,
// BPC-157 20mg, Retatrutide 30mg, CJC-1295/Ipamorelin 10mg/10mg - these
// four match the actual PO-2026-001 batch sizes), but each product's
// single price on the site was set from the GTM doc's "entry-size" pricing
// table, which may reference a smaller/different size than what's
// physically in stock. Confirm what size a customer actually receives at
// the listed price before this goes live - a label that doesn't match
// what's charged is a real risk, not just a cosmetic mismatch.
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
