// Verified chemical/technical data per compound, shown in the Technical
// Information section of product pages. Values were verified against
// PubChem / ChemicalBook / vendor property pages on 2026-08-18; anything
// that could not be verified is omitted (rendered as absent, never
// guessed). Matching is by product-name prefix, longest match first, so
// blends match before their component compounds.
//
// Second verification pass 2026-08-18: all values below confirmed against
// PubChem / MedChemExpress / vendor datasheets. GHK-Cu resolved: the 1:1
// copper(II) complex is C14H22CuN6O4, 401.9 g/mol, CAS 89030-95-5 (the
// CAS 49557-75-7 sometimes seen is the metal-FREE GHK tripeptide).

export type TechnicalData = {
  formula?: string;
  molarMass?: string;
  sequence?: string;
  synonyms?: string[];
  components?: string[];
  note?: string;
};

const D: Array<[string, TechnicalData]> = [
  // ---- Blends first (longest prefix wins) ----
  ["BPC-157/TB-500", { components: ["BPC-157", "TB-500"], synonyms: ["Wolverine blend"] }],
  ["Tesamorelin/Ipamorelin", { components: ["Tesamorelin", "Ipamorelin"] }],
  ["CJC-1295/Ipamorelin", { components: ["CJC-1295", "Ipamorelin"] }],
  ["KLOW", { components: ["GHK-Cu", "KPV", "BPC-157", "TB-500"] }],
  ["GLOW", { components: ["GHK-Cu", "BPC-157", "TB-500"] }],

  // ---- Singles ----
  ["BPC-157", { formula: "C62H98N16O22", molarMass: "1419.6 g/mol", sequence: "GEPPPGKPADDAGLV", synonyms: ["Pentadecapeptide BPC 157", "Bepecin", "PL 14736"] }],
  ["TB-500", { formula: "C212H350N56O78S", molarMass: "4963.4 g/mol", sequence: "SDKPDMAEIEKFDKSKLKKTETQEKNPLPSKETIEQEKQAGES", synonyms: ["Thymosin Beta-4", "TB4"] }],
  ["Tirzepatide", { formula: "C225H348N48O68", molarMass: "4813.5 g/mol", synonyms: ["LY3298176"] }],
  ["Retatrutide", { formula: "C221H342N46O68", molarMass: "4731.3 g/mol", synonyms: ["LY-3437943"] }],
  ["Semaglutide", { formula: "C187H291N45O59", molarMass: "4113.6 g/mol", synonyms: ["GLP-1 analog"] }],
  ["AOD-9604", { formula: "C78H123N23O23S2", molarMass: "1815.1 g/mol", sequence: "YLRIVQCRSVEGSCGF (disulfide Cys7-Cys14)", synonyms: ["hGH Fragment 176-191 analog"] }],
  ["Tesamorelin", { formula: "C221H366N72O67S", molarMass: "5135.9 g/mol", synonyms: ["TH9507", "GHRH(1-44) analog"] }],
  ["Ipamorelin", { formula: "C38H49N9O5", molarMass: "711.9 g/mol", sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH2", synonyms: ["NNC 26-0161"] }],
  ["Sermorelin", { formula: "C149H246N44O42S", molarMass: "3357.9 g/mol", synonyms: ["GRF (1-29)", "GHRH (1-29)"] }],
  ["GHRP-6", { formula: "C46H56N12O6", molarMass: "873.0 g/mol", sequence: "His-D-Trp-Ala-Trp-D-Phe-Lys-NH2", synonyms: ["Growth hormone releasing peptide-6"] }],
  ["IGF-1 LR3", { formula: "C400H625N111O115S9", molarMass: "9117.6 g/mol", synonyms: ["Long R3 IGF-I"] }],
  ["HCG", { molarMass: "~36.7 kDa (glycoprotein heterodimer)", synonyms: ["Human chorionic gonadotropin", "Choriogonadotropin"], note: "Glycoprotein; no discrete molecular formula." }],
  ["KPV", { formula: "C16H30N4O4", molarMass: "342.4 g/mol", sequence: "Lys-Pro-Val", synonyms: ["Alpha-MSH (11-13)"] }],
  ["VIP", { formula: "C147H238N44O42S", molarMass: "3325.8 g/mol", sequence: "HSDAVFTDNYTRLRKQMAVKKYLNSILN-NH2", synonyms: ["Vasoactive intestinal peptide"] }],
  ["Glutathione", { formula: "C10H17N3O6S", molarMass: "307.3 g/mol", sequence: "gamma-Glu-Cys-Gly", synonyms: ["GSH", "Reduced glutathione"] }],
  ["NAD+", { formula: "C21H27N7O14P2", molarMass: "663.4 g/mol", synonyms: ["Nicotinamide adenine dinucleotide", "Coenzyme I"] }],
  ["MOTS-c", { formula: "C101H152N28O22S2", molarMass: "2174.6 g/mol", sequence: "MRWQEMGYIFYPRKLR", synonyms: ["Mitochondrial-derived peptide MOTS-c"] }],
  ["SS-31", { formula: "C32H49N9O5", molarMass: "639.8 g/mol", sequence: "H-D-Arg-Dmt-Lys-Phe-NH2", synonyms: ["Elamipretide", "MTP-131", "Bendavia"] }],
  ["Epitalon", { formula: "C14H22N4O9", molarMass: "390.4 g/mol", sequence: "Ala-Glu-Asp-Gly (AEDG)", synonyms: ["Epithalon"] }],
  ["Thymosin Alpha-1", { formula: "C129H215N33O55", molarMass: "3108.3 g/mol", sequence: "Ac-SDAAVDTSSEITTKDLKEKKEVVEEAEN", synonyms: ["Thymalfasin"] }],
  ["LL-37", { formula: "C205H340N60O53", molarMass: "4493.4 g/mol", sequence: "LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES", synonyms: ["Human cathelicidin", "CAP-18 (109-140)"] }],
  ["N-Acetyl Selank", { sequence: "N-acetylated analog of Selank (TKPRPGP)", synonyms: ["Selank amidate analog"], note: "Parent peptide Selank: C33H57N11O9, 751.9 g/mol." }],
  ["N-Acetyl Semax", { formula: "C39H54N10O10S", molarMass: "855.0 g/mol", sequence: "N-acetylated analog of Semax (MEHFPGP)", synonyms: ["Ac-Semax"] }],
  ["Pinealon", { formula: "C15H26N6O8", molarMass: "418.4 g/mol", sequence: "Glu-Asp-Arg (EDR)", synonyms: ["EDR peptide"] }],
  ["GHK-Cu", { formula: "C14H22CuN6O4", molarMass: "401.9 g/mol", sequence: "Gly-His-Lys copper(II) complex (1:1)", synonyms: ["Copper Tripeptide-1", "Prezatide copper"] }],
  ["Melanotan I", { formula: "C78H111N21O19", molarMass: "1646.9 g/mol", sequence: "Ac-Ser-Tyr-Ser-Nle-Glu-His-D-Phe-Arg-Trp-Gly-Lys-Pro-Val-NH2", synonyms: ["Afamelanotide", "NDP-alpha-MSH"] }],
  ["Melanotan II", { formula: "C50H69N15O9", molarMass: "1024.2 g/mol", sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH2", synonyms: ["MT-II"] }],
  ["PT-141", { formula: "C50H68N14O10", molarMass: "1025.2 g/mol", sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH", synonyms: ["Bremelanotide"] }],
  ["Kisspeptin", { formula: "C63H83N17O14", molarMass: "1302.4 g/mol", sequence: "YNWNSFGLRF-NH2", synonyms: ["Kisspeptin-10", "Metastin (45-54)"] }],
  ["DSIP", { formula: "C35H48N10O15", molarMass: "848.8 g/mol", sequence: "WAGGDASGE", synonyms: ["Delta sleep-inducing peptide"] }],
  ["5-Amino-1MQ", { formula: "C10H11N2+ (cation)", molarMass: "286.1 g/mol (iodide salt)", synonyms: ["5-amino-1-methylquinolinium"] }],
  ["Bacteriostatic Water", { note: "Sterile water for research use preserved with 0.9% benzyl alcohol.", synonyms: ["BAC water"] }],
];

export function technicalDataFor(productName: string): TechnicalData | null {
  // Longest matching prefix wins. Ordering alone is not enough: the name
  // "Melanotan II 10mg" string-prefix-matches "Melanotan I" too, so list
  // order would hand Melanotan II the Melanotan I data.
  let best: TechnicalData | null = null;
  let bestLen = -1;
  for (const [prefix, data] of D) {
    if (
      productName.toLowerCase().startsWith(prefix.toLowerCase()) &&
      prefix.length > bestLen
    ) {
      best = data;
      bestLen = prefix.length;
    }
  }
  return best;
}

// Lookup a single component's data for blend component tables.
export function componentDataFor(componentName: string): TechnicalData | null {
  for (const [prefix, data] of D) {
    if (
      prefix.toLowerCase() === componentName.toLowerCase() &&
      !data.components
    ) {
      return data;
    }
  }
  return null;
}
