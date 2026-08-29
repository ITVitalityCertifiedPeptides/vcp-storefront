// Chemical structural class per product — a purely descriptive, non-
// outcome/benefit classification (per Josh's 2026-08-29 direction: shop
// surfaces should label products by what they structurally ARE, not by
// what body system/research area they're studied in; that framing now
// lives only in the Research Library, see research-area-by-compound.ts).
//
// Matching is by product-name prefix, longest match first, same pattern
// as research-areas.ts. Anything not matched below defaults to "Peptides"
// (the correct default: the large majority of the catalog is single
// synthetic peptides).

export const STRUCTURAL_CLASSES = [
  "Peptides",
  "Peptide Blends",
  "Small-Molecule Compounds",
  "Glycoprotein Hormones",
  "Metal-Complexed Peptides",
  "Laboratory Supplies & Accessories",
] as const;

export type StructuralClass = (typeof STRUCTURAL_CLASSES)[number];

const STRUCTURAL_CLASS_RULES: Array<[string, StructuralClass]> = [
  // ---- Peptide Blends (two or more peptide compounds in one product) ----
  ["BPC-157/TB-500", "Peptide Blends"],
  ["BPC/TB500", "Peptide Blends"],
  ["Tesamorelin/Ipamorelin", "Peptide Blends"],
  ["Tesa/Ipamorelin", "Peptide Blends"],
  ["CJC-1295/Ipamorelin", "Peptide Blends"],
  ["GLOW", "Peptide Blends"],
  ["KLOW", "Peptide Blends"],
  ["Beauty Blend", "Peptide Blends"],
  ["Deadpool Blend", "Peptide Blends"],
  ["Semax/Selank", "Peptide Blends"],

  // ---- Small-Molecule Compounds (non-peptide organic molecules) ----
  ["5 Amino 1", "Small-Molecule Compounds"],
  ["5-Amino-1MQ", "Small-Molecule Compounds"],
  ["SLU-PP-332", "Small-Molecule Compounds"],
  ["Dihexa", "Small-Molecule Compounds"],
  ["L-Carnitine", "Small-Molecule Compounds"],
  ["B-12", "Small-Molecule Compounds"],
  ["NAD+", "Small-Molecule Compounds"],
  ["Lipo-C", "Small-Molecule Compounds"],

  // ---- Glycoprotein Hormones ----
  ["HCG", "Glycoprotein Hormones"],

  // ---- Metal-Complexed Peptides (copper-chelated) ----
  ["GHK-Cu", "Metal-Complexed Peptides"],
  ["GHK-CU", "Metal-Complexed Peptides"],

  // ---- Laboratory Supplies & Accessories (non-chemical items) ----
  ["Bacteriostatic Water", "Laboratory Supplies & Accessories"],
  ["BAC Water", "Laboratory Supplies & Accessories"],
  ["10 Vial Case", "Laboratory Supplies & Accessories"],
  ["20 Vial Case", "Laboratory Supplies & Accessories"],
  ["3 Pen & 6 Vial Case", "Laboratory Supplies & Accessories"],
  ["9 Vial Case", "Laboratory Supplies & Accessories"],
  ["Peptide Pen", "Laboratory Supplies & Accessories"],
];

export function structuralClassFor(productName: string): StructuralClass {
  let best: StructuralClass = "Peptides";
  let bestLen = -1;
  const name = productName.toLowerCase();
  for (const [prefix, cls] of STRUCTURAL_CLASS_RULES) {
    if (name.startsWith(prefix.toLowerCase()) && prefix.length > bestLen) {
      best = cls;
      bestLen = prefix.length;
    }
  }
  return best;
}
