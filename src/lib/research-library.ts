// Research Library: a neutral bibliography of published, peer-reviewed
// papers involving compounds in the catalog. RULES for every entry, per
// the legal brief's content boundaries:
//  - Real, verified citations only. Every entry below was pulled from
//    live PubMed search results (2026-08-17) with its PMID; verify any
//    future addition the same way before adding it.
//  - Title, authors, journal, year, link. NO summaries of effects, no
//    benefit framing, no dosing detail, no editorializing.
//  - The page-level disclaimer (below) frames the whole section.
// More compounds are being added as their literature is verified.

export type ResearchEntry = {
  compound: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
};

export const libraryDisclaimer =
  "This library catalogs published scientific literature for research reference. Inclusion of a publication does not constitute a claim about any product sold on this site. Any reference to human or animal administration within a cited work describes that publication's own study design, not an intended use of any product sold here. All products are for laboratory research use only.";

const pm = (id: string) => `https://pubmed.ncbi.nlm.nih.gov/${id}/`;

export const researchLibrary: ResearchEntry[] = [
  // ---- BPC-157 ----
  { compound: "BPC-157", title: "Multifunctionality and Possible Medical Application of the BPC 157 Peptide: Literature and Patent Review", authors: "Jozwiak M, et al.", journal: "Pharmaceuticals (Basel)", year: 2025, url: pm("40005999") },
  { compound: "BPC-157", title: "Emerging Use of BPC-157 in Orthopaedic Sports Medicine: A Systematic Review", authors: "Vasireddi N, et al.", journal: "HSS Journal", year: 2025, url: pm("40756949") },
  { compound: "BPC-157", title: "Gastric pentadecapeptide body protection compound BPC 157 and its role in accelerating musculoskeletal soft tissue healing", authors: "Gwyer D, et al.", journal: "Cell and Tissue Research", year: 2019, url: pm("30915550") },
  { compound: "BPC-157", title: "Stable Gastric Pentadecapeptide BPC 157 and Wound Healing", authors: "Seiwerth S, et al.", journal: "Frontiers in Pharmacology", year: 2021, url: pm("34267654") },
  { compound: "BPC-157", title: "Pentadecapeptide BPC 157 and the central nervous system", authors: "Vukojevic J, et al.", journal: "Neural Regeneration Research", year: 2022, url: pm("34380875") },
  { compound: "BPC-157", title: "The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration", authors: "Chang CH, et al.", journal: "Journal of Applied Physiology", year: 2011, url: pm("21030672") },

  // ---- TB-500 / Thymosin Beta-4 ----
  { compound: "TB-500 (Thymosin Beta-4)", title: "Thymosin beta4: a multi-functional regenerative peptide. Basic properties and clinical applications", authors: "Goldstein AL, et al.", journal: "Expert Opinion on Biological Therapy", year: 2012, url: pm("22074294") },
  { compound: "TB-500 (Thymosin Beta-4)", title: "Beta-Thymosins", authors: "Hannappel E", journal: "Annals of the New York Academy of Sciences", year: 2007, url: pm("17468232") },
  { compound: "TB-500 (Thymosin Beta-4)", title: "Animal studies with thymosin beta4, a multifunctional tissue repair and regeneration peptide", authors: "Philp D, et al.", journal: "Annals of the New York Academy of Sciences", year: 2010, url: pm("20536453") },
  { compound: "TB-500 (Thymosin Beta-4)", title: "Thymosin beta-4 denotes new directions towards developing prosperous anti-aging regenerative therapies", authors: "Bock-Marquette I, et al.", journal: "International Immunopharmacology", year: 2023, url: pm("36709593") },
  { compound: "TB-500 (Thymosin Beta-4)", title: "Thymosin beta4: A Multi-Faceted Tissue Repair Stimulating Protein in Heart Injury", authors: "Bjorklund G, et al.", journal: "Current Medicinal Chemistry", year: 2020, url: pm("31333080") },

  // ---- Tirzepatide ----
  { compound: "Tirzepatide", title: "Tirzepatide versus Semaglutide Once Weekly in Patients with Type 2 Diabetes (SURPASS-2)", authors: "Frias JP, et al.", journal: "New England Journal of Medicine", year: 2021, url: pm("34170647") },
  { compound: "Tirzepatide", title: "Tirzepatide Once Weekly for the Treatment of Obesity (SURMOUNT-1)", authors: "Jastreboff AM, et al.", journal: "New England Journal of Medicine", year: 2022, url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038" },
  { compound: "Tirzepatide", title: "Efficacy and safety of a novel dual GIP and GLP-1 receptor agonist tirzepatide in patients with type 2 diabetes (SURPASS-1)", authors: "Rosenstock J, et al.", journal: "The Lancet", year: 2021, url: pm("34186022") },
  { compound: "Tirzepatide", title: "Tirzepatide: A Review in Type 2 Diabetes", authors: "France NL, et al.", journal: "Drugs", year: 2024, url: pm("38388874") },
  { compound: "Tirzepatide", title: "Tirzepatide for Metabolic Dysfunction-Associated Steatohepatitis with Liver Fibrosis", authors: "Loomba R, et al.", journal: "New England Journal of Medicine", year: 2024, url: pm("38856224") },
  { compound: "Tirzepatide", title: "Tirzepatide, a dual GIP/GLP-1 receptor co-agonist for the treatment of type 2 diabetes", authors: "Nauck MA, et al.", journal: "Cardiovascular Diabetology", year: 2022, url: pm("36050763") },

  // ---- Retatrutide ----
  { compound: "Retatrutide", title: "Triple-Hormone-Receptor Agonist Retatrutide for Obesity: A Phase 2 Trial", authors: "Jastreboff AM, et al.", journal: "New England Journal of Medicine", year: 2023, url: pm("37366315") },
  { compound: "Retatrutide", title: "Retatrutide, a GIP, GLP-1 and glucagon receptor agonist, for people with type 2 diabetes", authors: "Rosenstock J, et al.", journal: "The Lancet", year: 2023, url: pm("37385280") },
  { compound: "Retatrutide", title: "Triple hormone receptor agonist retatrutide for metabolic dysfunction-associated steatotic liver disease", authors: "Sanyal AJ, et al.", journal: "Nature Medicine", year: 2024, url: pm("38858523") },
  { compound: "Retatrutide", title: "Effects of retatrutide on body composition in people with type 2 diabetes", authors: "Coskun T, et al.", journal: "The Lancet Diabetes & Endocrinology", year: 2025, url: pm("40609566") },
  { compound: "Retatrutide", title: "Retatrutide: A Game Changer in Obesity Pharmacotherapy", authors: "Katsi V, et al.", journal: "Biomolecules", year: 2025, url: pm("40563436") },

  // ---- Semaglutide ----
  { compound: "Semaglutide", title: "Semaglutide 2.4 mg once a week in adults with overweight or obesity, and type 2 diabetes (STEP 2)", authors: "Davies M, et al.", journal: "The Lancet", year: 2021, url: pm("33667417") },
  { compound: "Semaglutide", title: "Effect of Subcutaneous Semaglutide vs Placebo as an Adjunct to Intensive Behavioral Therapy on Body Weight (STEP 3)", authors: "Wadden TA, et al.", journal: "JAMA", year: 2021, url: pm("33625476") },
  { compound: "Semaglutide", title: "Semaglutide for the treatment of obesity", authors: "Chao AM, et al.", journal: "Trends in Cardiovascular Medicine", year: 2023, url: pm("34942372") },
  { compound: "Semaglutide", title: "Semaglutide vs Tirzepatide for Weight Loss in Adults With Overweight or Obesity", authors: "Rodriguez PJ, et al.", journal: "JAMA Internal Medicine", year: 2024, url: pm("38976257") },
  { compound: "Semaglutide", title: "Oral Semaglutide at a Dose of 25 mg in Adults with Overweight or Obesity", authors: "Wharton S, et al.", journal: "New England Journal of Medicine", year: 2025, url: pm("40934115") },

  // ---- Tesamorelin ----
  { compound: "Tesamorelin", title: "Tesamorelin", authors: "Grunfeld C, et al.", journal: "Nature Reviews Drug Discovery", year: 2011, url: pm("21283099") },
  { compound: "Tesamorelin", title: "Tesamorelin: a review of its use in the management of HIV-associated lipodystrophy", authors: "Dhillon S", journal: "Drugs", year: 2011, url: pm("21668043") },
  { compound: "Tesamorelin", title: "Tesamorelin: a growth hormone-releasing factor analogue for HIV-associated lipodystrophy", authors: "Spooner LM, Olin JL", journal: "Annals of Pharmacotherapy", year: 2012, url: pm("22298602") },
  { compound: "Tesamorelin", title: "Efficacy and safety of tesamorelin in people with HIV on integrase inhibitors", authors: "Russo SC, et al.", journal: "AIDS", year: 2024, url: pm("38905488") },

  // ---- CJC-1295 ----
  { compound: "CJC-1295", title: "Prolonged stimulation of growth hormone (GH) and insulin-like growth factor I secretion by CJC-1295, a long-acting analog of GH-releasing hormone, in healthy adults", authors: "Teichman SL, et al.", journal: "Journal of Clinical Endocrinology & Metabolism", year: 2006, url: pm("16352683") },
  { compound: "CJC-1295", title: "Activation of the GH/IGF-1 axis by CJC-1295, a long-acting GHRH analog, results in serum protein profile changes in normal adult subjects", authors: "Sackmann-Sala L, et al.", journal: "Growth Hormone & IGF Research", year: 2009, url: pm("19386527") },
  { compound: "CJC-1295", title: "Advances in the detection of growth hormone releasing hormone synthetic analogs", authors: "Memdouh S, et al.", journal: "Drug Testing and Analysis", year: 2021, url: pm("34665524") },

  // ---- Ipamorelin ----
  { compound: "Ipamorelin", title: "Ipamorelin, the first selective growth hormone secretagogue", authors: "Raun K, et al.", journal: "European Journal of Endocrinology", year: 1998, url: pm("9849822") },
  { compound: "Ipamorelin", title: "Beyond the androgen receptor: the role of growth hormone secretagogues in the modern management of body composition in hypogonadal males", authors: "Sinha DK, et al.", journal: "Translational Andrology and Urology", year: 2020, url: pm("32257855") },

  // ---- MOTS-c ----
  { compound: "MOTS-c", title: "The mitochondrial-derived peptide MOTS-c promotes metabolic homeostasis and reduces obesity and insulin resistance", authors: "Lee C, et al.", journal: "Cell Metabolism", year: 2015, url: pm("25738459") },
  { compound: "MOTS-c", title: "The Mitochondrial-Encoded Peptide MOTS-c Translocates to the Nucleus to Regulate Nuclear Gene Expression in Response to Metabolic Stress", authors: "Kim KH, et al.", journal: "Cell Metabolism", year: 2018, url: pm("29983246") },
  { compound: "MOTS-c", title: "MOTS-c: A promising mitochondrial-derived peptide for therapeutic exploitation", authors: "Zheng Y, et al.", journal: "Frontiers in Endocrinology", year: 2023, url: pm("36761202") },
  { compound: "MOTS-c", title: "MOTS-c, the Most Recent Mitochondrial Derived Peptide in Human Aging and Age-Related Diseases", authors: "Mohtashami Z, et al.", journal: "International Journal of Molecular Sciences", year: 2022, url: pm("36233287") },
  { compound: "MOTS-c", title: "Mitochondrial-derived microprotein MOTS-c attenuates immobilization-induced skeletal muscle atrophy by suppressing lipid infiltration", authors: "Kumagai H, et al.", journal: "American Journal of Physiology: Endocrinology and Metabolism", year: 2024, url: pm("38170165") },

  // ---- SS-31 (Elamipretide) ----
  { compound: "SS-31 (Elamipretide)", title: "Elamipretide: A Review of Its Structure, Mechanism of Action, and Therapeutic Potential", authors: "Tung C, et al.", journal: "International Journal of Molecular Sciences", year: 2025, url: pm("39940712") },
  { compound: "SS-31 (Elamipretide)", title: "Elamipretide (SS-31) improves mitochondrial dysfunction, synaptic and memory impairment induced by lipopolysaccharide in mice", authors: "Zhao W, et al.", journal: "Journal of Neuroinflammation", year: 2019, url: pm("31747905") },
  { compound: "SS-31 (Elamipretide)", title: "The Mitochondria-Targeted Peptide Therapeutic Elamipretide Improves Cardiac and Skeletal Muscle Function During Aging", authors: "Mitchell W, et al.", journal: "Aging Cell", year: 2025, url: pm("40080911") },
  { compound: "SS-31 (Elamipretide)", title: "Genotype-specific effects of elamipretide in patients with primary mitochondrial myopathy: a post hoc analysis of the MMPOWER-3 trial", authors: "Karaa A, et al.", journal: "Orphanet Journal of Rare Diseases", year: 2024, url: pm("39574155") },
  { compound: "SS-31 (Elamipretide)", title: "Contemporary insights into elamipretide's mitochondrial mechanism of action and therapeutic effects", authors: "Sabbah HN, et al.", journal: "Biomedicine & Pharmacotherapy", year: 2025, url: pm("40294492") },

  // ---- Thymosin Alpha-1 ----
  { compound: "Thymosin Alpha-1", title: "Thymosin alpha 1: A comprehensive review of the literature", authors: "Dominari A, et al.", journal: "World Journal of Virology", year: 2020, url: pm("33362999") },
  { compound: "Thymosin Alpha-1", title: "Immune Modulation with Thymosin Alpha 1 Treatment", authors: "King R, et al.", journal: "Vitamins and Hormones", year: 2016, url: pm("27450734") },
  { compound: "Thymosin Alpha-1", title: "Thymosin alpha-1 in cancer therapy: Immunoregulation and potential applications", authors: "Wei Y, et al.", journal: "International Immunopharmacology", year: 2023, url: pm("36812669") },
  { compound: "Thymosin Alpha-1", title: "Thymosin alpha 1 treatment for patients with sepsis", authors: "Pei F, et al.", journal: "Expert Opinion on Biological Therapy", year: 2018, url: pm("30063866") },
  { compound: "Thymosin Alpha-1", title: "Aging and Thymosin Alpha-1", authors: "Simonova MA, et al.", journal: "International Journal of Molecular Sciences", year: 2025, url: pm("41373628") },

  // ---- Cross-compound peptide science ----
  { compound: "General Peptide Science", title: "Safety and Efficacy of Approved and Unapproved Peptide Therapies for Musculoskeletal Injuries and Athletic Performance", authors: "Mendias CL, et al.", journal: "Sports Medicine", year: 2026, url: pm("41966639") },
  { compound: "General Peptide Science", title: "Injectable Peptide Therapy: A Primer for Orthopaedic and Sports Medicine Physicians", authors: "Mayfield CK, et al.", journal: "American Journal of Sports Medicine", year: 2026, url: pm("41476424") },
  { compound: "General Peptide Science", title: "Therapeutic Peptides in Aesthetic, Metabolic and Endocrine Conditions: Effects, Safety, Clinical Applications, and Future Perspectives", authors: "Renke G, et al.", journal: "International Journal of Molecular Sciences", year: 2026, url: pm("42123471") },
];
