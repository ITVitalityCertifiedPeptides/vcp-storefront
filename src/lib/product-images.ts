// Product photography keyed by product slug, used by ProductCard (a
// client component that cannot read the filesystem the way the product
// page's gallery does). Catalog structure: one individual product per
// size, so keys are per-size slugs.
//
// 2026-08-19: the single-compound batch landed. Every entry pointing at a
// "-hero.jpg" is the new 2:3 (1024x1536) hero standard. Entries still
// pointing at a plain "<slug>.jpg" are the old square shots kept only
// until Josh's next batch (blends, HCG, Pinealon, N-Acetyl Selank,
// Glutathione, BAC Water, and the sizes called out below) replaces them.
export const productImages: Record<string, string> = {
  // ---- New 2:3 heroes (single-compound batch, 2026-08-19) ----
  "5-amino-1mq-10mg": "/products/5-amino-1mq-10mg-hero.jpg",
  "aod-9604-5mg": "/products/aod-9604-5mg-hero.jpg",
  "bpc-157-5mg": "/products/bpc-157-5mg-hero.jpg",
  "bpc-157-10mg": "/products/bpc-157-10mg-hero.jpg",
  "bpc-157-20mg": "/products/bpc-157-20mg-hero.jpg",
  "dsip-5mg": "/products/dsip-5mg-hero.jpg",
  "dsip-15mg": "/products/dsip-15mg-hero.jpg",
  "epitalon-10mg": "/products/epitalon-10mg-hero.jpg",
  "ghk-cu-50mg": "/products/ghk-cu-50mg-hero.jpg",
  "ghrp-6-5mg": "/products/ghrp-6-5mg-hero.jpg",
  "igf-1-lr3-1mg": "/products/igf-1-lr3-1mg-hero.jpg",
  "ipamorelin-10mg": "/products/ipamorelin-10mg-hero.jpg",
  "kisspeptin-5mg": "/products/kisspeptin-5mg-hero.jpg",
  "kisspeptin-10mg": "/products/kisspeptin-10mg-hero.jpg",
  "kpv-30mg": "/products/kpv-30mg-hero.jpg",
  "ll-37-5mg": "/products/ll-37-5mg-hero.jpg",
  "melanotan-i-10mg": "/products/melanotan-i-10mg-hero.jpg",
  "melanotan-ii-10mg": "/products/melanotan-ii-10mg-hero.jpg",
  "mots-c-10mg": "/products/mots-c-10mg-hero.jpg",
  "mots-c-40mg": "/products/mots-c-40mg-hero.jpg",
  "n-acetyl-semax-10mg": "/products/n-acetyl-semax-10mg-hero.jpg",
  "nadplus-500mg": "/products/nadplus-500mg-hero.jpg",
  "nadplus-1000mg": "/products/nadplus-1000mg-hero.jpg",
  "pt-141-10mg": "/products/pt-141-10mg-hero.jpg",
  "retatrutide-10mg": "/products/retatrutide-10mg-hero.jpg",
  "retatrutide-20mg": "/products/retatrutide-20mg-hero.jpg",
  "retatrutide-30mg": "/products/retatrutide-30mg-hero.jpg",
  "semaglutide-10mg": "/products/semaglutide-10mg-hero.jpg",
  "sermorelin-10mg": "/products/sermorelin-10mg-hero.jpg",
  "ss-31-10mg": "/products/ss-31-10mg-hero.jpg",
  "ss-31-50mg": "/products/ss-31-50mg-hero.jpg",
  "tb-500-5mg": "/products/tb-500-5mg-hero.jpg",
  "tb-500-10mg": "/products/tb-500-10mg-hero.jpg",
  "tesamorelin-10mg": "/products/tesamorelin-10mg-hero.jpg",
  "thymosin-alpha-1-5mg": "/products/thymosin-alpha-1-5mg-hero.jpg",
  "thymosin-alpha-1-10mg": "/products/thymosin-alpha-1-10mg-hero.jpg",
  "tirzepatide-10mg": "/products/tirzepatide-10mg-hero.jpg",
  "tirzepatide-20mg": "/products/tirzepatide-20mg-hero.jpg",
  "tirzepatide-30mg": "/products/tirzepatide-30mg-hero.jpg",
  "vip-10mg": "/products/vip-10mg-hero.jpg",
  "bpc-157-tb-500-10mg-10mg": "/products/bpc-157-tb-500-10mg-10mg-hero.jpg",
  "bpc-157-tb-500-30mg-30mg": "/products/bpc-157-tb-500-30mg-30mg-hero.jpg",
  "cjc-1295-ipamorelin-5mg-5mg": "/products/cjc-1295-ipamorelin-5mg-5mg-hero.jpg",
  "cjc-1295-ipamorelin-10mg-10mg": "/products/cjc-1295-ipamorelin-10mg-10mg-hero.jpg",
  "bacteriostatic-water-10ml": "/products/bacteriostatic-water-10ml-hero.jpg",

  // ---- Old square shots, awaiting replacement in the next batch ----
  "tesamorelin-20mg": "/products/tesamorelin-20mg.jpg",
  "tesamorelin-ipamorelin-10mg-3mg": "/products/tesamorelin-ipamorelin-10mg-3mg.jpg",
  "hcg-10000iu": "/products/hcg-10000iu.jpg",
  "kpv-10mg": "/products/kpv-10mg.jpg",
  "glutathione-1500mg": "/products/glutathione-1500mg.jpg",
  "mots-c-20mg": "/products/mots-c-20mg.jpg",
  "ss-31-30mg": "/products/ss-31-30mg.jpg",
  "epitalon-50mg": "/products/epitalon-50mg.jpg",
  "n-acetyl-selank-10mg": "/products/n-acetyl-selank-10mg.jpg",
  "pinealon-20mg": "/products/pinealon-20mg.jpg",
  "ghk-cu-100mg": "/products/ghk-cu-100mg.jpg",
  "glow-70mg": "/products/glow-70mg.jpg",
  "klow-80mg": "/products/klow-80mg.jpg",
};
