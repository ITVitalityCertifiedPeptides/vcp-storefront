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
  // NOT applied on 2026-09-03 - no confident product-name match found or a
  // genuine name collision risk at the time (see delivery notes): Dihexa
  // 10mg, DSIP 10mg, L-Carnitine, Oxytocin 10mg (candidates only existed as
  // the nasal-spray SKUs, differently named/slugged), SNAP-8 10/20mg, and
  // the Selank/Semax "acetylated variant shares the exact same product name
  // as the original" pairs (10mg/30mg) - picking one file for a shared slug
  // would silently misattribute a photo to the wrong SKU.
  //
  // ---- 2026-09-04: catalog-growth batch (Josh: "lets updated the photos
  // on all products. i think you have to do this for both circle and
  // retail"). The VCP_All_Product_Hero_Photos folder grew from ~90 files to
  // 142 since the 09-03 pass, and the live Swell catalog grew too (now 203
  // products, pulled fresh via the admin Console) - re-running the
  // name-match against current data resolves everything the 09-03 pass had
  // flagged, plus covers ~30 more products the catalog gained since then
  // (BPC-157 15mg, GHRP-2/6 alternate doses, CJC-1295 No/With-DAC 5/10mg,
  // Tesamorelin/Ipamorelin combo doses, the Cortagen/Crystagen-style
  // peptide-bioregulator line at their missing doses, etc). Judgment calls
  // made rather than guessed blindly - flag to Josh if any should be
  // reversed:
  //   - Dihexa 10mg / DSIP 10mg / L-Carnitine / Oxytocin 10mg / Snap8
  //     10mg+20mg: the 09-03 concern was a possible collision with a
  //     differently-dosed nasal-spray/capsule SKU of the same name. The
  //     fresh catalog pull shows each now exists as its own plain-vial
  //     product with no competing SKU sharing its exact name - safe to map.
  //   - Selank 10mg / Semax 10mg / Semax 30mg: the photo shoot has TWO
  //     vial-label photos for each (e.g. "SELANK-10" vs "SELANK-A-10").
  //     Checked whether the "-A-" file might actually belong to a separate
  //     acetylated-variant product (as is genuinely the case for Semax
  //     Acetyl 30mg, which has its own already-mapped photo) - it doesn't:
  //     no "Selank 10mg (Acetyl)" or "Semax 10mg (Acetyl)" product exists,
  //     so both photos are the same product, just two label print runs.
  //     Picked the plain (non "-A-") file for each; the other is still
  //     sitting in the shoot folder if Josh prefers it instead.
  //   - GLOW (GHK-Cu/BPC/TB4) 50/10/10mg and KLOW (GHK-Cu/BPC/TB4/KPV)
  //     50/10/10/10mg: the OLD "glow-70mg"/"klow-80mg" slugs above (still
  //     .jpg) are orphaned - no product is named exactly "GLOW 70mg" or
  //     "KLOW 80mg" in the current catalog, so those two keys never match
  //     anything live and are harmless dead weight (left as-is rather than
  //     deleted, in case Josh wants to trace them back). The current
  //     product names slugify to "glow-ghk-cu-bpc-tb4-50-10-10mg" and
  //     "klow-ghk-cu-bpc-tb4-kpv-50-10-10-10mg" below. The shoot folder has
  //     a short-named duplicate for each too (Glow-70mg-hero.png,
  //     KLOW-80mg-hero.png, both same total dose) - used the
  //     fully-descriptive filename instead since every other file in this
  //     batch is named to match the current product name, not a stale one.
  //   - GLOW 100/20/20mg and KLOW 100/20/20/20mg: no prior mapping existed
  //     at any dose - both are new.
  //   - "SLU-PP-332 10 mg" has a literal space before "mg" in Swell (a
  //     product-name typo, not mine) - its slug is "slu-pp-332-10-mg", one
  //     character off from the already-mapped "slu-pp-332-10mg" above. Both
  //     keys are harmless to keep; worth fixing the typo in Swell admin if
  //     Josh wants the cleaner URL.
  // Public/products in both repos already has every file below (copied
  // 2026-09-04 from the same shoot folder, renamed to match its slug). ----
  "ahk-cu-100mg": "/products/ahk-cu-100mg-hero.png", // AHK-CU 100mg
  "ahk-cu-50mg": "/products/ahk-cu-50mg-hero.png", // AHK-CU 50mg
  "aod-9604-tesamorelin-5-5mg": "/products/aod-9604-tesamorelin-5-5mg-hero.png", // AOD-9604/Tesamorelin 5/5mg
  "ara-290-10mg": "/products/ara-290-10mg-hero.png", // ARA-290 10mg
  "ara-290-16mg": "/products/ara-290-16mg-hero.png", // ARA-290 16mg
  "beauty-blend-ghk-kpv": "/products/beauty-blend-ghk-kpv-hero.png", // Beauty Blend GHK/KPV
  "bpc-157-15mg": "/products/bpc-157-15mg-hero.png", // BPC-157 15mg
  "bpc-157-tb-500-10-10mg": "/products/bpc-157-tb-500-10-10mg-hero.png", // BPC-157/TB-500 10/10mg
  "bpc-157-tb-500-10mg": "/products/bpc-157-tb-500-10mg-hero.png", // BPC-157/TB-500 10mg
  "bpc-157-tb-500-20-20mg": "/products/bpc-157-tb-500-20-20mg-hero.png", // BPC-157/TB-500 20/20mg
  "bpc-157-tb-500-20mg": "/products/bpc-157-tb-500-20mg-hero.png", // BPC-157/TB-500 20mg
  "bpc-157-tb-500-5-5mg": "/products/bpc-157-tb-500-5-5mg-hero.png", // BPC-157/TB-500 5/5mg
  "bronchogen": "/products/bronchogen-hero.png", // Bronchogen
  "cartalax": "/products/cartalax-hero.png", // Cartalax
  "cartalax-20mg": "/products/cartalax-20mg-hero.png", // Cartalax 20mg
  "cjc-1295-no-dac-10mg": "/products/cjc-1295-no-dac-10mg-hero.png", // CJC-1295 No DAC 10mg
  "cjc-1295-no-dac-5mg": "/products/cjc-1295-no-dac-5mg-hero.png", // CJC-1295 No DAC 5mg
  "cjc-1295-w-dac-10mg": "/products/cjc-1295-w-dac-10mg-hero.png", // CJC-1295 w/ DAC 10mg
  "cjc-1295-w-dac-5mg": "/products/cjc-1295-w-dac-5mg-hero.png", // CJC-1295 w/ DAC 5mg
  "deadpool-blend-bpc-tb-cartalax": "/products/deadpool-blend-bpc-tb-cartalax-hero.png", // Deadpool Blend (BPC/TB/Cartalax)
  "dihexa-10mg": "/products/dihexa-10mg-hero.png", // Dihexa 10mg
  "dsip-10mg": "/products/dsip-10mg-hero.png", // DSIP 10mg
  "fox04-dri-10mg": "/products/fox04-dri-10mg-hero.png", // FOX04-DRI 10mg
  "ghrp-2-10mg": "/products/ghrp-2-10mg-hero.png", // GHRP-2 10mg
  "ghrp-2-5mg": "/products/ghrp-2-5mg-hero.png", // GHRP-2 5mg
  "ghrp-6-10mg": "/products/ghrp-6-10mg-hero.png", // GHRP-6 10mg
  "glow-ghk-cu-bpc-tb4-100-20-20mg": "/products/glow-ghk-cu-bpc-tb4-100-20-20mg-hero.png", // GLOW (GHK-Cu/BPC/TB4) 100/20/20mg
  "glow-ghk-cu-bpc-tb4-50-10-10mg": "/products/glow-ghk-cu-bpc-tb4-50-10-10mg-hero.png", // GLOW (GHK-Cu/BPC/TB4) 50/10/10mg
  "hcg-5000iu": "/products/hcg-5000iu-hero.png", // HCG 5000IU
  "ipamorelin-5mg": "/products/ipamorelin-5mg-hero.png", // Ipamorelin 5mg
  "ipamorelin-cjc-1295-10-10mg": "/products/ipamorelin-cjc-1295-10-10mg-hero.png", // Ipamorelin/CJC-1295 10/10mg
  "klow-ghk-cu-bpc-tb4-kpv-100-20-20-20mg": "/products/klow-ghk-cu-bpc-tb4-kpv-100-20-20-20mg-hero.png", // KLOW (GHK-Cu/BPC/TB4/KPV) 100/20/20/20mg
  "klow-ghk-cu-bpc-tb4-kpv-50-10-10-10mg": "/products/klow-ghk-cu-bpc-tb4-kpv-50-10-10-10mg-hero.png", // KLOW (GHK-Cu/BPC/TB4/KPV) 50/10/10/10mg
  "l-carnitine": "/products/l-carnitine-hero.png", // L-Carnitine
  "oxytocin-10mg": "/products/oxytocin-10mg-hero.png", // Oxytocin 10mg
  "p-21-5mg": "/products/p-21-5mg-hero.png", // P-21 5mg
  "pda-10mg": "/products/pda-10mg-hero.png", // PDA 10mg
  "selank-10mg": "/products/selank-10mg-hero.png", // Selank 10mg
  "semax-10mg": "/products/semax-10mg-hero.png", // Semax 10mg
  "semax-30mg": "/products/semax-30mg-hero.png", // Semax 30mg
  "semax-selank-10-10mg": "/products/semax-selank-10-10mg-hero.png", // Semax/Selank 10/10mg
  "semax-selank-30-10mg": "/products/semax-selank-30-10mg-hero.png", // Semax/Selank 30/10mg
  "sermorelin-5mg": "/products/sermorelin-5mg-hero.png", // Sermorelin 5mg
  "slu-pp-332-10-mg": "/products/slu-pp-332-10-mg-hero.png", // SLU-PP-332 10 mg
  "snap8-10mg": "/products/snap8-10mg-hero.png", // Snap8 10mg
  "snap8-20mg": "/products/snap8-20mg-hero.png", // Snap8 20mg
  "tb-500-frag-17-23": "/products/tb-500-frag-17-23-hero.png", // TB-500 Frag 17-23
  "tesamorelin-5mg": "/products/tesamorelin-5mg-hero.png", // Tesamorelin 5mg
  "tesamorelin-ipamorelin-10-10mg": "/products/tesamorelin-ipamorelin-10-10mg-hero.png", // Tesamorelin/Ipamorelin 10/10mg
  "tesamorelin-ipamorelin-10-5mg": "/products/tesamorelin-ipamorelin-10-5mg-hero.png", // Tesamorelin/Ipamorelin 10/5mg
  "tesamorelin-ipamorelin-13mg-3mg": "/products/tesamorelin-ipamorelin-13mg-3mg-hero.png", // Tesamorelin/Ipamorelin 13mg/3mg
  "tesamorelin-ipamorelin-6mg-3mg": "/products/tesamorelin-ipamorelin-6mg-3mg-hero.png", // Tesamorelin/Ipamorelin 6mg/3mg
  "thymosin-alpha-1": "/products/thymosin-alpha-1-hero.png", // Thymosin Alpha-1
  "tirzepatide-60mg": "/products/tirzepatide-60mg-hero.png", // Tirzepatide 60mg
  "vip-5mg": "/products/vip-5mg-hero.png", // VIP 5mg
};
