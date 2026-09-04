// Product photography keyed by product slug, used by ProductCard (a
// client component that cannot read the filesystem the way the product
// page's gallery does). Catalog structure: one individual product per
// size, so keys are per-size slugs.
//
// 2026-08-19: full catalog on the 2:3 (1024x1536) hero standard. The old
// square shots are fully retired.
export const productImages: Record<string, string> = {
  // ---- New 2:3 heroes (single-compound batch, 2026-08-19) ----
  "5-amino-1mq-10mg": "/products/5-amino-1mq-10mg-hero.jpg",
  "bpc-157-5mg": "/products/bpc-157-5mg-hero.jpg",
  "bpc-157-10mg": "/products/bpc-157-10mg-hero.jpg",
  "bpc-157-20mg": "/products/bpc-157-20mg-hero.jpg",
  "dsip-15mg": "/products/dsip-15mg-hero.jpg",
  "ghrp-6-5mg": "/products/ghrp-6-5mg-hero.jpg",
  // Renamed from "IGF-1 LR3" to "IGF-LR3" at some point - the photo file
  // is the same shot, just renamed to match the current slug so the
  // filesystem auto-discovery in product-gallery.ts finds it again.
  "igf-lr3-1mg": "/products/igf-lr3-1mg-hero.jpg",
  "ipamorelin-10mg": "/products/ipamorelin-10mg-hero.jpg",
  "kisspeptin-5mg": "/products/kisspeptin-5mg-hero.jpg",
  "kpv-30mg": "/products/kpv-30mg-hero.jpg",
  "ll-37-5mg": "/products/ll-37-5mg-hero.jpg",
  "mots-c-10mg": "/products/mots-c-10mg-hero.jpg",
  "mots-c-40mg": "/products/mots-c-40mg-hero.jpg",
  "n-acetyl-semax-10mg": "/products/n-acetyl-semax-10mg-hero.jpg",
  "pt-141-10mg": "/products/pt-141-10mg-hero.jpg",
  "sermorelin-10mg": "/products/sermorelin-10mg-hero.jpg",
  "ss-31-10mg": "/products/ss-31-10mg-hero.jpg",
  "ss-31-50mg": "/products/ss-31-50mg-hero.jpg",
  "tb-500-5mg": "/products/tb-500-5mg-hero.jpg",
  "tb-500-10mg": "/products/tb-500-10mg-hero.jpg",
  "tesamorelin-10mg": "/products/tesamorelin-10mg-hero.jpg",
  "thymosin-alpha-1-5mg": "/products/thymosin-alpha-1-5mg-hero.jpg",
  "thymosin-alpha-1-10mg": "/products/thymosin-alpha-1-10mg-hero.jpg",
  "tirzepatide-20mg": "/products/tirzepatide-20mg-hero.jpg",
  "tirzepatide-30mg": "/products/tirzepatide-30mg-hero.jpg",
  "vip-10mg": "/products/vip-10mg-hero.jpg",
  "bpc-157-tb-500-10mg-10mg": "/products/bpc-157-tb-500-10mg-10mg-hero.jpg",
  "bpc-157-tb-500-30mg-30mg": "/products/bpc-157-tb-500-30mg-30mg-hero.jpg",
  "cjc-1295-ipamorelin-5mg-5mg": "/products/cjc-1295-ipamorelin-5mg-5mg-hero.jpg",
  "cjc-1295-ipamorelin-10mg-10mg": "/products/cjc-1295-ipamorelin-10mg-10mg-hero.jpg",
  "bacteriostatic-water-10ml": "/products/bacteriostatic-water-10ml-hero.jpg",
  "glow-70mg": "/products/glow-70mg-hero.jpg",
  "hcg-10000iu": "/products/hcg-10000iu-hero.jpg",
  "klow-80mg": "/products/klow-80mg-hero.jpg",
  "kpv-10mg": "/products/kpv-10mg-hero.jpg",
  "mots-c-20mg": "/products/mots-c-20mg-hero.jpg",
  "ss-31-30mg": "/products/ss-31-30mg-hero.jpg",
  "tesamorelin-20mg": "/products/tesamorelin-20mg-hero.jpg",
  "tesamorelin-ipamorelin-10mg-3mg": "/products/tesamorelin-ipamorelin-10mg-3mg-hero.jpg",
  // ---- New heroes, 2026-09-01 batch (Josh: "here are the product photos
  // please add these and remove the product coming soon photos" - only
  // for products that had no photo yet; Josh: "if there is already a
  // product photo ignore the new one") ----
  "5-amino-1mq-50mg": "/products/5-amino-1mq-50mg-hero.png",
  "adamax-10mg": "/products/adamax-10mg-hero.png",
  "adamax-5mg": "/products/adamax-5mg-hero.png",
  "aod-9604-10mg": "/products/aod-9604-10mg-hero.png",
  "aod-9604-2mg": "/products/aod-9604-2mg-hero.png",
  // Every product now has a 2:3 hero except Bacteriostatic Water 30mL,
  // which falls back to the drawn vial icon until its image lands.

  // ---- 2026-09-03: full pro photo shoot batch (VCP_All_Product_Hero_Photos).
  // Replaces 19 older heroes (still .jpg from the 2026-08-19/09-01 batches -
  // the stale .jpg was deleted from public/products alongside this update,
  // since galleryImages() checks jpg before png and a leftover .jpg would
  // have silently kept winning) and adds heroes for products that had none
  // yet, including several not-yet-live 2026-09-03 candidate products and
  // three already-live-but-photo-less ones (SLU-PP-332 5/10mg, Survodutide).
  // GLP-1 products (Retatrutide/Tirzepatide/Semaglutide/Cagrilintide/
  // Survodutide/PX-prefixed) are retail-hidden as of the same-day GLP-1
  // retail removal - their heroes are here for Inner Circle/Wholesale,
  // where they still show, and cost nothing sitting unused on retail. ----
  "aod-9604-5mg": "/products/aod-9604-5mg-hero.png",
  "dsip-5mg": "/products/dsip-5mg-hero.png",
  "epitalon-10mg": "/products/epitalon-10mg-hero.png",
  "epitalon-50mg": "/products/epitalon-50mg-hero.png",
  "ghk-cu-100mg": "/products/ghk-cu-100mg-hero.png",
  "ghk-cu-50mg": "/products/ghk-cu-50mg-hero.png",
  "glutathione-1500mg": "/products/glutathione-1500mg-hero.png",
  "kisspeptin-10mg": "/products/kisspeptin-10mg-hero.png",
  "melanotan-i-10mg": "/products/melanotan-i-10mg-hero.png",
  "melanotan-ii-10mg": "/products/melanotan-ii-10mg-hero.png",
  "n-acetyl-selank-10mg": "/products/n-acetyl-selank-10mg-hero.png",
  "nadplus-1000mg": "/products/nadplus-1000mg-hero.png",
  "nadplus-500mg": "/products/nadplus-500mg-hero.png",
  "pinealon-20mg": "/products/pinealon-20mg-hero.png",
  "retatrutide-10mg": "/products/retatrutide-10mg-hero.png",
  "retatrutide-20mg": "/products/retatrutide-20mg-hero.png",
  "retatrutide-30mg": "/products/retatrutide-30mg-hero.png",
  "semaglutide-10mg": "/products/semaglutide-10mg-hero.png",
  "tirzepatide-10mg": "/products/tirzepatide-10mg-hero.png",
  // already-live, previously had no hero at all
  "slu-pp-332-5mg": "/products/slu-pp-332-5mg-hero.png",
  "slu-pp-332-10mg": "/products/slu-pp-332-10mg-hero.png",
  "survodutide": "/products/survodutide-hero.png",
  // not-yet-live candidate products (2026-09-03 batch) - harmless to have
  // a hero ready now, picked up automatically once each goes active
  "b-12-1mg": "/products/b-12-1mg-hero.png",
  "cagrilintide-10mg": "/products/cagrilintide-10mg-hero.png",
  "cagrilintide-5mg": "/products/cagrilintide-5mg-hero.png",
  "cardiogen-20mg": "/products/cardiogen-20mg-hero.png",
  "chonluten-20mg": "/products/chonluten-20mg-hero.png",
  "cortagen-20mg": "/products/cortagen-20mg-hero.png",
  "crystagen-20mg": "/products/crystagen-20mg-hero.png",
  "dihexa-5mg": "/products/dihexa-5mg-hero.png",
  "glutathione-600mg": "/products/glutathione-600mg-hero.png",
  "gonadorelin-10mg": "/products/gonadorelin-10mg-hero.png",
  "ovagen-20mg": "/products/ovagen-20mg-hero.png",
  "pancragen-20mg": "/products/pancragen-20mg-hero.png",
  "prostamax-20mg": "/products/prostamax-20mg-hero.png",
  "px1-sem-semaglutide-15mg": "/products/px1-sem-semaglutide-15mg-hero.png",
  "px12-t-tirzepatide-40mg": "/products/px12-t-tirzepatide-40mg-hero.png",
  "px13-r-retatrutide-40mg": "/products/px13-r-retatrutide-40mg-hero.png",
  "retatrutide-12mg": "/products/retatrutide-12mg-hero.png",
  "retatrutide-24mg": "/products/retatrutide-24mg-hero.png",
  "retatrutide-48mg": "/products/retatrutide-48mg-hero.png",
  "retatrutide-60mg": "/products/retatrutide-60mg-hero.png",
  "retatrutide-6mg": "/products/retatrutide-6mg-hero.png",
  "semaglutide-20mg": "/products/semaglutide-20mg-hero.png",
  "semaglutide-5mg": "/products/semaglutide-5mg-hero.png",
  "semax-acetyl-30mg": "/products/semax-acetyl-30mg-hero.png",
  "testagen-20mg": "/products/testagen-20mg-hero.png",
  "thymalin-20mg": "/products/thymalin-20mg-hero.png",
  "tirzepatide-15mg": "/products/tirzepatide-15mg-hero.png",
  "vesugen-20mg": "/products/vesugen-20mg-hero.png",
  "vilon-20mg": "/products/vilon-20mg-hero.png",
  // NOT applied - no confident product-name match found or a genuine name
  // collision risk (see delivery notes): Dihexa 10mg, DSIP 10mg,
  // L-Carnitine, Oxytocin 10mg (candidates only exist as the nasal-spray
  // SKUs, differently named/slugged), SNAP-8 10/20mg, and the Selank/Semax
  // "acetylated variant shares the exact same product name as the
  // original" pairs (10mg/30mg) - picking one file for a shared slug would
  // silently misattribute a photo to the wrong SKU.
};
