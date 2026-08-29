// Maps each `compound` value used in research-library.ts to the published
// research area it's most associated with, so the Research Library page can
// offer an area filter/browse (Josh, 2026-08-29: "in our research page with
// links and studies let's use the research area naming... if in the research
// library area they can see the peptides people are using to research [by
// area]"). Values are the SAME raw category keys used elsewhere in the site
// (content.category / CATEGORY_DISPLAY in catalog-shared.ts), so
// displayCategory() renders them with the existing safe area labels ("Metabolic
// Research", "Endocrine Research", etc.) with zero new copy to maintain.
//
// This is a distinct, research-literature-facing lookup — separate from
// structural-class.ts, which is the purely descriptive (non-outcome) label
// now used on shop-facing product surfaces. Keep the two separate; do not
// reuse one for the other.
//
// A few compounds are broader than one area in the literature; each is
// assigned the single area its cited studies in research-library.ts are
// actually about, so the mapping stays literature-defensible rather than
// aspirational. "General Peptide Science" is not a real category key, so
// displayCategory() passes it through unchanged, which is what we want.

import { displayCategory } from "./catalog-shared";

const AREA_BY_COMPOUND: Record<string, string> = {
  "5-Amino-1MQ": "Cellular Repair/Longevity",
  "AOD-9604": "Metabolic/Weight Loss",
  "BPC-157": "Inflammation/Recovery",
  "CJC-1295": "Growth Hormone/Endocrine",
  DSIP: "Sleep",
  Epitalon: "Cellular Repair/Longevity",
  "General Peptide Science": "General Peptide Science",
  "GHK-Cu": "Skin/Cosmetic",
  "GHRP-6": "Growth Hormone/Endocrine",
  Glutathione: "Skin/Cosmetic",
  HCG: "Sexual Health",
  "IGF-1 LR3": "Growth Hormone/Endocrine",
  Ipamorelin: "Growth Hormone/Endocrine",
  Kisspeptin: "Growth Hormone/Endocrine",
  KPV: "Inflammation/Recovery",
  "LL-37": "Immune Support",
  "Melanotan I": "Skin/Cosmetic",
  "Melanotan II": "Sexual Health",
  "MOTS-c": "Metabolic/Weight Loss",
  "NAD+": "Cellular Repair/Longevity",
  Pinealon: "Nootropic",
  "PT-141 (Bremelanotide)": "Sexual Health",
  Retatrutide: "Metabolic/Weight Loss",
  "Selank & Semax": "Nootropic",
  Semaglutide: "Metabolic/Weight Loss",
  Sermorelin: "Growth Hormone/Endocrine",
  "SS-31 (Elamipretide)": "Cellular Repair/Longevity",
  "TB-500 (Thymosin Beta-4)": "Inflammation/Recovery",
  Tesamorelin: "Metabolic/Weight Loss",
  "Thymosin Alpha-1": "Immune Support",
  Tirzepatide: "Metabolic/Weight Loss",
  "VIP (Vasoactive Intestinal Peptide)": "Inflammation/Recovery",
};

export function areaForCompound(compound: string): string {
  return AREA_BY_COMPOUND[compound] || "General Peptide Science";
}

export function areaLabelForCompound(compound: string): string {
  return displayCategory(areaForCompound(compound));
}

// Every distinct area label currently in use, for populating a filter
// dropdown, in a stable/sensible order (matches CATEGORY_DISPLAY's order
// where applicable, "General Peptide Science" last since it's a catch-all).
export function allResearchAreaLabels(): string[] {
  const raw = Array.from(new Set(Object.values(AREA_BY_COMPOUND)));
  const order = [
    "Metabolic/Weight Loss",
    "Growth Hormone/Endocrine",
    "Inflammation/Recovery",
    "Cellular Repair/Longevity",
    "Immune Support",
    "Nootropic",
    "Skin/Cosmetic",
    "Sexual Health",
    "Sleep",
    "General Peptide Science",
  ];
  return order.filter((a) => raw.includes(a)).map((a) => displayCategory(a));
}
