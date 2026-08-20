// Secondary research areas per compound. The primary area lives on the
// Swell product (content.category) and drives the breadcrumb and JSON-LD;
// these secondaries are literature-supported additional areas of study,
// shown on the product page and used to ALSO list the product on those
// categories' pages. Values are RAW Swell category values (the same ones
// used in content.category), so slug and display-name mapping is reused.
//
// Compliance framing holds: an entry here means the compound has been
// studied in that area's published literature, never a claim about what
// the product does for a user. Keep entries conservative and defensible.
//
// Matching is by product-name prefix, longest match first (so blends and
// "Melanotan II" resolve before their shorter lookalikes).

const SECONDARY_AREAS: Array<[string, string[]]> = [
  // Blends
  ["Tesamorelin/Ipamorelin", ["Metabolic/Weight Loss"]],
  ["GLOW", ["Inflammation/Recovery"]],
  ["KLOW", ["Inflammation/Recovery"]],

  // Singles
  ["Tesamorelin", ["Metabolic/Weight Loss"]],
  ["AOD-9604", ["Inflammation/Recovery"]],
  ["5-Amino-1MQ", ["Cellular Repair/Longevity"]],
  ["MOTS-c", ["Metabolic/Weight Loss"]],
  ["Epitalon", ["Sleep"]],
  ["HCG", ["Sexual Health"]],
  ["Kisspeptin", ["Growth Hormone/Endocrine"]],
  ["Melanotan II", ["Sexual Health"]],
  ["GHK-Cu", ["Inflammation/Recovery"]],
  ["LL-37", ["Inflammation/Recovery"]],
  ["VIP", ["Inflammation/Recovery"]],
  ["N-Acetyl Selank", ["Immune Support"]],
  ["DSIP", ["Nootropic"]],
  ["IGF-1 LR3", ["Inflammation/Recovery"]],
  ["Glutathione", ["Skin/Cosmetic"]],
];

export function secondaryAreasFor(productName: string): string[] {
  let best: string[] = [];
  let bestLen = -1;
  for (const [prefix, areas] of SECONDARY_AREAS) {
    if (
      productName.toLowerCase().startsWith(prefix.toLowerCase()) &&
      prefix.length > bestLen
    ) {
      best = areas;
      bestLen = prefix.length;
    }
  }
  return best;
}
