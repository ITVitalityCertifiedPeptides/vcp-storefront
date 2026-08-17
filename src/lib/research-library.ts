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

  // ---- LL-37 ----
  { compound: "LL-37", title: "The LL-37 domain: A clue to cathelicidin immunomodulatory response?", authors: "Leite, et al.", journal: "Peptides", year: 2023, url: pm("37068711") },
  { compound: "LL-37", title: "Antibiofilm properties of cathelicidin LL-37: an in-depth review", authors: "Memariani, et al.", journal: "World Journal of Microbiology and Biotechnology", year: 2023, url: pm("36781570") },
  { compound: "LL-37", title: "Cathelicidin peptide LL-37: A multifunctional peptide involved in heart disease", authors: "Miao, et al.", journal: "Pharmacological Research", year: 2024, url: pm("39615616") },
  { compound: "LL-37", title: "Antifungal properties of cathelicidin LL-37: current knowledge and future research directions", authors: "Memariani, et al.", journal: "World Journal of Microbiology and Biotechnology", year: 2023, url: pm("38057654") },
  { compound: "LL-37", title: "LL-37: Cathelicidin-related antimicrobial peptide with pleiotropic activity", authors: "Fabisiak, et al.", journal: "Pharmacological Reports", year: 2016, url: pm("27117377") },
  { compound: "LL-37", title: "Cathelicidin LL-37: a multitask antimicrobial peptide", authors: "Bucki, et al.", journal: "Archivum Immunologiae et Therapiae Experimentalis", year: 2010, url: pm("20049649") },
  { compound: "LL-37", title: "Design of Antimicrobial Peptides: Progress Made with Human Cathelicidin LL-37", authors: "Wang, et al.", journal: "Advances in Experimental Medicine and Biology", year: 2019, url: pm("30980360") },

  // ---- GHK-Cu ----
  { compound: "GHK-Cu", title: "Regenerative and Protective Actions of the GHK-Cu Peptide in the Light of the New Gene Data", authors: "Pickart L, et al.", journal: "International Journal of Molecular Sciences", year: 2018, url: pm("29986520") },
  { compound: "GHK-Cu", title: "The potential of GHK as an anti-aging peptide", authors: "Dou, et al.", journal: "Aging Pathobiology and Therapeutics", year: 2020, url: pm("35083444") },
  { compound: "GHK-Cu", title: "Topically applied GHK as an anti-wrinkle peptide: Advantages, problems and prospective", authors: "Mortazavi, et al.", journal: "BioImpacts", year: 2024, url: pm("39963574") },
  { compound: "GHK-Cu", title: "GHK Peptide as a Natural Modulator of Multiple Cellular Pathways in Skin Regeneration", authors: "Pickart L, et al.", journal: "BioMed Research International", year: 2015, url: pm("26236730") },
  { compound: "GHK-Cu", title: "Tripeptide-copper complex GHK-Cu (II) transiently improved healing outcome in a rat model of ACL reconstruction", authors: "Fu, et al.", journal: "Journal of Orthopaedic Research", year: 2015, url: pm("25731775") },
  { compound: "GHK-Cu", title: "Glycyl-l-histidyl-l-lysine-Cu2+ rescues cigarette smoking-induced skeletal muscle dysfunction via a sirtuin 1-dependent pathway", authors: "Deng, et al.", journal: "Journal of Cachexia, Sarcopenia and Muscle", year: 2023, url: pm("36905132") },
  { compound: "GHK-Cu", title: "Exploring the beneficial effects of GHK-Cu on an experimental model of colitis and the underlying mechanisms", authors: "Mao, et al.", journal: "Frontiers in Pharmacology", year: 2025, url: pm("40672369") },

  // ---- Kisspeptin ----
  { compound: "Kisspeptin", title: "The Role of Kisspeptin in the Control of the Hypothalamic-Pituitary-Gonadal Axis and Reproduction", authors: "Xie, et al.", journal: "Frontiers in Endocrinology", year: 2022, url: pm("35837314") },
  { compound: "Kisspeptin", title: "Kisspeptin and mammalian reproduction", authors: "Tsukamura, et al.", journal: "Peptides", year: 2024, url: pm("39306000") },
  { compound: "Kisspeptin", title: "Metabolic regulation of kisspeptin - the link between energy balance and reproduction", authors: "Navarro VM", journal: "Nature Reviews Endocrinology", year: 2020, url: pm("32427949") },
  { compound: "Kisspeptin", title: "Kisspeptin in Reproduction", authors: "Seminara SB, et al.", journal: "Seminars in Reproductive Medicine", year: 2007, url: pm("17710729") },
  { compound: "Kisspeptin", title: "Kisspeptin isoforms: versatile players in reproduction and beyond", authors: "Chakraborty, et al.", journal: "Journal of Molecular Endocrinology", year: 2025, url: pm("40271959") },
  { compound: "Kisspeptin", title: "Kisspeptin in female reproduction", authors: "Lee, et al.", journal: "Journal of the Chinese Medical Association", year: 2021, url: pm("33883468") },

  // ---- PT-141 (Bremelanotide) ----
  { compound: "PT-141 (Bremelanotide)", title: "Bremelanotide: First Approval", authors: "Dhillon S, et al.", journal: "Drugs", year: 2019, url: pm("31429064") },
  { compound: "PT-141 (Bremelanotide)", title: "Bremelanotide for Treatment of Female Hypoactive Sexual Desire", authors: "Edinoff, et al.", journal: "Neurology International", year: 2022, url: pm("35076581") },
  { compound: "PT-141 (Bremelanotide)", title: "Bremelanotide: New Drug Approved for Treating Hypoactive Sexual Desire Disorder", authors: "Mayer, et al.", journal: "Annals of Pharmacotherapy", year: 2020, url: pm("31893927") },
  { compound: "PT-141 (Bremelanotide)", title: "An evaluation of bremelanotide injection for the treatment of hypoactive sexual desire disorder", authors: "Cipriani, et al.", journal: "Expert Opinion on Pharmacotherapy", year: 2022, url: pm("36242769") },
  { compound: "PT-141 (Bremelanotide)", title: "The neurobiology of bremelanotide for the treatment of hypoactive sexual desire disorder in premenopausal women", authors: "Pfaus, et al.", journal: "CNS Spectrums", year: 2022, url: pm("33455598") },

  // ---- Melanotan I ----
  { compound: "Melanotan I", title: "Afamelanotide for Erythropoietic Protoporphyria", authors: "Langendonk JG, et al.", journal: "New England Journal of Medicine", year: 2015, url: pm("26132941") },
  { compound: "Melanotan I", title: "Discovery and development of novel melanogenic drugs. Melanotan-I and -II", authors: "Hadley ME, et al.", journal: "Pharmaceutical Biotechnology", year: 1998, url: pm("9760697") },
  { compound: "Melanotan I", title: "Use of melanotan I and II in the general population", authors: "Evans-Brown, et al.", journal: "BMJ", year: 2009, url: pm("19224885") },

  // ---- Melanotan II ----
  { compound: "Melanotan II", title: "Discovery and development of novel melanogenic drugs. Melanotan-I and -II", authors: "Hadley ME, et al.", journal: "Pharmaceutical Biotechnology", year: 1998, url: pm("9760697") },
  { compound: "Melanotan II", title: "Use of melanotan I and II in the general population", authors: "Evans-Brown, et al.", journal: "BMJ", year: 2009, url: pm("19224885") },
  { compound: "Melanotan II", title: "CLIPSing Melanotan-II to Discover Multiple Functionally Selective hMCR Agonists", authors: "Tomassi, et al.", journal: "Journal of Medicinal Chemistry", year: 2022, url: pm("35188390") },
  { compound: "Melanotan II", title: "Melanotan II User Experience: A Qualitative Study of Online Discussion Forums", authors: "Gilhooley, et al.", journal: "Dermatology", year: 2021, url: pm("34464955") },
  { compound: "Melanotan II", title: "Melanotan II injection resulting in systemic toxicity and rhabdomyolysis", authors: "Nelson, et al.", journal: "Clinical Toxicology", year: 2012, url: pm("23121206") },

  // ---- DSIP ----
  { compound: "DSIP", title: "Delta-sleep-inducing peptide (DSIP): A review", authors: "Graf MV, et al.", journal: "Neuroscience & Biobehavioral Reviews", year: 1984, url: pm("6145137") },
  { compound: "DSIP", title: "Delta sleep-inducing peptide (DSIP): a still unresolved riddle", authors: "Kovalzon VM, et al.", journal: "Journal of Neurochemistry", year: 2006, url: pm("16539679") },
  { compound: "DSIP", title: "Delta-sleep-inducing peptide (DSIP): An update", authors: "Graf MV, et al.", journal: "Peptides", year: 1986, url: pm("3550726") },
  { compound: "DSIP", title: "Delta Sleep-Inducing Peptide Recovers Motor Function in SD Rats after Focal Stroke", authors: "Tukhovskaya, et al.", journal: "Molecules", year: 2021, url: pm("34500605") },
  { compound: "DSIP", title: "Phosphorylated delta sleep inducing peptide restores spatial memory and p-CREB expression by improving sleep architecture at high altitude", authors: "Roy, et al.", journal: "Life Sciences", year: 2018, url: pm("30107169") },

  // ---- Epitalon ----
  { compound: "Epitalon", title: "Overview of Epitalon - Highly Bioactive Pineal Tetrapeptide with Promising Properties", authors: "Araj, et al.", journal: "International Journal of Molecular Sciences", year: 2025, url: pm("40141333") },
  { compound: "Epitalon", title: "Epitalon increases telomere length in human cell lines through telomerase upregulation or ALT activity", authors: "Al-Dulaimi, et al.", journal: "Biogerontology", year: 2025, url: pm("40908429") },
  { compound: "Epitalon", title: "Peptides and Ageing", authors: "Khavinson VKh", journal: "Neuro Endocrinology Letters", year: 2002, url: pm("12374906") },
  { compound: "Epitalon", title: "Epitalon protects against post-ovulatory aging-related damage of mouse oocytes in vitro", authors: "Yue, et al.", journal: "Aging", year: 2022, url: pm("35413689") },
  { compound: "Epitalon", title: "Epithalon Decelerates Aging and Suppresses Development of Breast Adenocarcinomas in Transgenic HER-2/neu Mice", authors: "Anisimov VN, et al.", journal: "Bulletin of Experimental Biology and Medicine", year: 2002, url: pm("12459848") },
  { compound: "Epitalon", title: "The Antioxidant Tetrapeptide Epitalon Enhances Delayed Wound Healing in an in Vitro Model of Diabetic Retinopathy", authors: "Gatta, et al.", journal: "Stem Cell Reviews and Reports", year: 2025, url: pm("40493162") },

  // ---- Selank & Semax ----
  { compound: "Selank & Semax", title: "Functional Connectomic Approach to Studying Selank and Semax Effects", authors: "Panikratova, et al.", journal: "Doklady Biological Sciences", year: 2020, url: pm("32342318") },
  { compound: "Selank & Semax", title: "Semax peptide targets the mu opioid receptor gene Oprm1 to promote deubiquitination and functional recovery after spinal cord injury in female mice", authors: "Liu, et al.", journal: "British Journal of Pharmacology", year: 2025, url: pm("40692165") },
  { compound: "Selank & Semax", title: "Peptides semax and selank affect the behavior of rats with 6-OHDA induced PD-like parkinsonism", authors: "Slominsky, et al.", journal: "Doklady Biological Sciences", year: 2017, url: pm("28702721") },
  { compound: "Selank & Semax", title: "Semax and Selank Inhibit the Enkephalin-Degrading Enzymes of Human Serum", authors: "Kost, et al.", journal: "Russian Journal of Bioorganic Chemistry", year: 2001, url: pm("11443939") },
  { compound: "Selank & Semax", title: "Selank Administration Affects the Expression of Some Genes Involved in GABAergic Neurotransmission", authors: "Volkova, et al.", journal: "Frontiers in Pharmacology", year: 2016, url: pm("26924987") },
  { compound: "Selank & Semax", title: "ACTH-like Peptides Compensate Rat Brain Gene Expression Profile Disrupted by Ischemia a Day After Experimental Stroke", authors: "Filippenkov, et al.", journal: "Biomedicines", year: 2024, url: pm("39767736") },

  // ---- KPV ----
  { compound: "KPV", title: "Alpha-Melanocyte-Stimulating Hormone, MSH 11-13 KPV and Adrenocorticotropic Hormone Signalling in Human Keratinocyte Cells", authors: "Elliott, et al.", journal: "Journal of Investigative Dermatology", year: 2004, url: pm("15102092") },
  { compound: "KPV", title: "Orally Targeted Delivery of Tripeptide KPV via Hyaluronic Acid-Functionalized Nanoparticles Efficiently Alleviates Ulcerative Colitis", authors: "Xiao, et al.", journal: "Molecular Therapy", year: 2017, url: pm("28143741") },
  { compound: "KPV", title: "Melanocortin-derived tripeptide KPV has anti-inflammatory potential in murine models of inflammatory bowel disease", authors: "Kannengiesser, et al.", journal: "Inflammatory Bowel Diseases", year: 2008, url: pm("18092346") },
  { compound: "KPV", title: "New Insights into the Functions of Alpha-MSH and Related Peptides in the Immune System", authors: "Luger TA, et al.", journal: "Annals of the New York Academy of Sciences", year: 2003, url: pm("12851308") },
  { compound: "KPV", title: "Antimicrobial effects of alpha-MSH peptides", authors: "Cutuli, et al.", journal: "Journal of Leukocyte Biology", year: 2000, url: pm("10670585") },
  { compound: "KPV", title: "Alpha-MSH related peptides: a new class of anti-inflammatory and immunomodulating drugs", authors: "Luger TA, et al.", journal: "Annals of the Rheumatic Diseases", year: 2007, url: pm("17934097") },

  // ---- GHRP-6 ----
  { compound: "GHRP-6", title: "Growth hormone-releasing peptides", authors: "Ghigo E, et al.", journal: "European Journal of Endocrinology", year: 1997, url: pm("9186261") },
  { compound: "GHRP-6", title: "Growth hormone releasing peptide-6 (GHRP-6) prevents doxorubicin-induced myocardial and extra-myocardial damages by activating prosurvival mechanisms", authors: "Berlanga-Acosta, et al.", journal: "Frontiers in Pharmacology", year: 2024, url: pm("38873418") },
  { compound: "GHRP-6", title: "Growth hormone-releasing peptide 6 (GHRP-6) hydrogel for acute kidney injury therapy via metabolic regulation", authors: "Zhao, et al.", journal: "Journal of Nanobiotechnology", year: 2025, url: pm("41327290") },

  // ---- AOD-9604 ----
  { compound: "AOD-9604", title: "Metabolic studies of a synthetic lipolytic domain (AOD9604) of human growth hormone", authors: "Ng FM, et al.", journal: "Hormone Research", year: 2000, url: pm("11146367") },
  { compound: "AOD-9604", title: "The effects of human GH and its lipolytic fragment (AOD9604) on lipid metabolism following chronic treatment in obese mice and beta(3)-AR knock-out mice", authors: "Heffernan M, et al.", journal: "Endocrinology", year: 2001, url: pm("11713213") },
  { compound: "AOD-9604", title: "Increase of fat oxidation and weight loss in obese mice caused by chronic treatment with human growth hormone or a modified C-terminal fragment", authors: "Heffernan MA, et al.", journal: "International Journal of Obesity and Related Metabolic Disorders", year: 2001, url: pm("11673763") },
  { compound: "AOD-9604", title: "Effect of Intra-articular Injection of AOD9604 with or without Hyaluronic Acid in Rabbit Osteoarthritis Model", authors: "Kwon DR, et al.", journal: "Annals of Clinical and Laboratory Science", year: 2015, url: pm("26275694") },
  { compound: "AOD-9604", title: "AOD-9604 Metabolic", authors: "Wilding J", journal: "Current Opinion in Investigational Drugs", year: 2004, url: pm("15134286") },
  { compound: "AOD-9604", title: "Detection and in vitro metabolism of AOD9604", authors: "Cox HD, et al.", journal: "Drug Testing and Analysis", year: 2015, url: pm("25208511") },

  // ---- 5-Amino-1MQ ----
  { compound: "5-Amino-1MQ", title: "Selective and membrane-permeable small molecule inhibitors of nicotinamide N-methyltransferase reverse high fat diet-induced obesity in mice", authors: "Neelakantan H, et al.", journal: "Biochemical Pharmacology", year: 2018, url: pm("29155147") },
  { compound: "5-Amino-1MQ", title: "Nicotinamide N-methyltransferase inhibition mitigates obesity-related metabolic dysfunction", authors: "Babula JJ, et al.", journal: "Diabetes, Obesity and Metabolism", year: 2024, url: pm("39161060") },
  { compound: "5-Amino-1MQ", title: "Reduced calorie diet combined with NNMT inhibition establishes a distinct microbiome in DIO mice", authors: "Dimet-Wiley A, et al.", journal: "Scientific Reports", year: 2022, url: pm("35013352") },
  { compound: "5-Amino-1MQ", title: "Novel tricyclic small molecule inhibitors of Nicotinamide N-methyltransferase for the treatment of metabolic disorders", authors: "Ruf S, et al.", journal: "Scientific Reports", year: 2022, url: pm("36104373") },

  // ---- NAD+ ----
  { compound: "NAD+", title: "NAD+ metabolism and its roles in cellular processes during ageing", authors: "Covarrubias AJ, et al.", journal: "Nature Reviews Molecular Cell Biology", year: 2021, url: pm("33353981") },
  { compound: "NAD+", title: "NAD+ in aging, metabolism, and neurodegeneration", authors: "Verdin E", journal: "Science", year: 2015, url: pm("26785480") },
  { compound: "NAD+", title: "NAD+ metabolism: pathophysiologic mechanisms and therapeutic potential", authors: "Xie N, et al.", journal: "Signal Transduction and Targeted Therapy", year: 2020, url: pm("33028824") },
  { compound: "NAD+", title: "Therapeutic Potential of NAD-Boosting Molecules: The In Vivo Evidence", authors: "Rajman L, et al.", journal: "Cell Metabolism", year: 2018, url: pm("29514064") },
  { compound: "NAD+", title: "NAD+ Intermediates: The Biology and Therapeutic Potential of NMN and NR", authors: "Yoshino J, et al.", journal: "Cell Metabolism", year: 2018, url: pm("29249689") },
  { compound: "NAD+", title: "NAD+ in Brain Aging and Neurodegenerative Disorders", authors: "Lautrup S, et al.", journal: "Cell Metabolism", year: 2019, url: pm("31577933") },

  // ---- Glutathione ----
  { compound: "Glutathione", title: "Glutathione metabolism and its implications for health", authors: "Wu G, et al.", journal: "Journal of Nutrition", year: 2004, url: pm("14988435") },
  { compound: "Glutathione", title: "An Update on Glutathione's Biosynthesis, Metabolism, Functions, and Medicinal Purposes", authors: "Gasmi A, et al.", journal: "Current Medicinal Chemistry", year: 2024, url: pm("37921175") },
  { compound: "Glutathione", title: "Glutathione and glutathione-dependent enzymes: From biochemistry to gerontology and successful aging", authors: "Lapenna D", journal: "Ageing Research Reviews", year: 2023, url: pm("37683986") },
  { compound: "Glutathione", title: "The role of glutathione peroxidase-1 in health and disease", authors: "Handy DE, et al.", journal: "Free Radical Biology and Medicine", year: 2022, url: pm("35691509") },
  { compound: "Glutathione", title: "Glutathione metabolism in ferroptosis and cancer therapy", authors: "Xue X, et al.", journal: "Cancer Letters", year: 2025, url: pm("40189013") },

  // ---- VIP ----
  { compound: "VIP (Vasoactive Intestinal Peptide)", title: "The significance of vasoactive intestinal peptide in immunomodulation", authors: "Delgado M, et al.", journal: "Pharmacological Reviews", year: 2004, url: pm("15169929") },
  { compound: "VIP (Vasoactive Intestinal Peptide)", title: "Vasoactive intestinal peptide in the immune system: potential therapeutic role in inflammatory and autoimmune diseases", authors: "Delgado M, et al.", journal: "Journal of Molecular Medicine", year: 2002, url: pm("11862320") },
  { compound: "VIP (Vasoactive Intestinal Peptide)", title: "Pituitary adenylate cyclase-activating polypeptide/vasoactive intestinal peptide (Part 1): biology, pharmacology, and new insights into their cellular basis of action/signaling", authors: "Moody TW, et al.", journal: "Current Opinion in Endocrinology, Diabetes and Obesity", year: 2021, url: pm("33449573") },
  { compound: "VIP (Vasoactive Intestinal Peptide)", title: "Therapeutic potential of vasoactive intestinal peptide and its receptor VPAC2 in type 2 diabetes", authors: "Hou X, et al.", journal: "Frontiers in Endocrinology", year: 2022, url: pm("36204104") },
  { compound: "VIP (Vasoactive Intestinal Peptide)", title: "The role of vasoactive intestinal peptide in pulmonary diseases", authors: "Zhong HL, et al.", journal: "Life Sciences", year: 2023, url: pm("37742737") },
  { compound: "VIP (Vasoactive Intestinal Peptide)", title: "Role of vasoactive intestinal peptide in osteoarthritis", authors: "Jiang W, et al.", journal: "Journal of Biomedical Science", year: 2016, url: pm("27553659") },

  // ---- Pinealon ----
  { compound: "Pinealon", title: "Pinealon increases cell viability by suppression of free radical levels and activating proliferative processes", authors: "Khavinson V, et al.", journal: "Rejuvenation Research", year: 2011, url: pm("21978084") },
  { compound: "Pinealon", title: "EDR Peptide: Possible Mechanism of Gene Expression and Protein Synthesis Regulation Involved in the Pathogenesis of Alzheimer's Disease", authors: "Khavinson V, et al.", journal: "Molecules", year: 2020, url: pm("33396470") },
  { compound: "Pinealon", title: "Short Peptides Protect Fibroblast-Derived Induced Neurons from Age-Related Changes", authors: "Kraskovskaya N, et al.", journal: "International Journal of Molecular Sciences", year: 2024, url: pm("39518916") },
  { compound: "Pinealon", title: "Regulation of content of cytokines in blood serum and of caspase-3 activity in brains of old rats in model of sharp hypoxic hypoxia with Cortexin and Pinealon", authors: "Mendzheritskii AM, et al.", journal: "Advances in Gerontology", year: 2014, url: pm("25051764") },
  { compound: "Pinealon", title: "Investigation of antihypoxic properties of short peptides", authors: "Kozina LS, et al.", journal: "Advances in Gerontology", year: 2008, url: pm("18546825") },
  { compound: "Pinealon", title: "Penetration of short fluorescence-labeled peptides into the nucleus in HeLa cells and in vitro specific interaction of the peptides with deoxyribooligonucleotides and DNA", authors: "Fedoreyeva LI, et al.", journal: "Biochemistry (Moscow)", year: 2011, url: pm("22117547") },

  // ---- IGF-1 LR3 ----
  { compound: "IGF-1 LR3", title: "Recombinant expression of IGF-1 and LR3 IGF-1 fused with xylanase in Pichia pastoris", authors: "Lu Z, et al.", journal: "Applied Microbiology and Biotechnology", year: 2023, url: pm("37261455") },
  { compound: "IGF-1 LR3", title: "Detection of His-tagged Long-R3-IGF-I in a black market product", authors: "Kohler M, et al.", journal: "Growth Hormone & IGF Research", year: 2010, url: pm("20675162") },
  { compound: "IGF-1 LR3", title: "The somatotropic axis in neonatal calves can be modulated by nutrition, growth hormone, and Long-R3-IGF-I", authors: "Hammon H, et al.", journal: "American Journal of Physiology", year: 1997, url: pm("9252489") },
  { compound: "IGF-1 LR3", title: "IGF-1 LR3 does not promote growth in late-gestation growth-restricted fetal sheep", authors: "White A, et al.", journal: "American Journal of Physiology: Endocrinology and Metabolism", year: 2025, url: pm("39679943") },
  { compound: "IGF-1 LR3", title: "Attenuated glucose-stimulated insulin secretion during an acute IGF-1 LR3 infusion into fetal sheep does not persist in isolated islets", authors: "White A, et al.", journal: "Journal of Developmental Origins of Health and Disease", year: 2023, url: pm("37114757") },
  { compound: "IGF-1 LR3", title: "Design and characterisation of long-R3-insulin-like growth factor-I muteins which show resistance to pepsin digestion", authors: "Bryant KJ, et al.", journal: "Growth Factors", year: 1996, url: pm("8919033") },

  // ---- Sermorelin ----
  { compound: "Sermorelin", title: "Sermorelin: a better approach to management of adult-onset growth hormone insufficiency?", authors: "Walker RF", journal: "Clinical Interventions in Aging", year: 2006, url: pm("18046908") },
  { compound: "Sermorelin", title: "Sermorelin: a review of its use in the diagnosis and treatment of children with idiopathic growth hormone deficiency", authors: "Prakash A, et al.", journal: "BioDrugs", year: 1999, url: pm("18031173") },
  { compound: "Sermorelin", title: "A potentially effective drug for patients with recurrent glioma: sermorelin", authors: "Chang Y, et al.", journal: "Annals of Translational Medicine", year: 2021, url: pm("33842627") },
  { compound: "Sermorelin", title: "Advances in the detection of growth hormone releasing hormone synthetic analogs", authors: "Memdouh S, et al.", journal: "Drug Testing and Analysis", year: 2021, url: pm("34665524") },

  // ---- HCG ----
  { compound: "HCG", title: "hCG: Biological Functions and Clinical Applications", authors: "Nwabuobi C, et al.", journal: "International Journal of Molecular Sciences", year: 2017, url: pm("28937611") },
  { compound: "HCG", title: "Biological functions of hCG and hCG-related molecules", authors: "Cole LA", journal: "Reproductive Biology and Endocrinology", year: 2010, url: pm("20735820") },
  { compound: "HCG", title: "Anabolic steroid-induced hypogonadism: diagnosis and treatment", authors: "Rahnema CD, et al.", journal: "Fertility and Sterility", year: 2014, url: pm("24636400") },
  { compound: "HCG", title: "Treatment of Men with Central Hypogonadism: Alternatives for Testosterone Replacement Therapy", authors: "Ide V, et al.", journal: "International Journal of Molecular Sciences", year: 2020, url: pm("33375030") },
  { compound: "HCG", title: "Testosterone replacement therapy and spermatogenesis in reproductive age men", authors: "Naelitz BD, et al.", journal: "Nature Reviews Urology", year: 2025, url: pm("40346275") },

  // ---- Cross-compound peptide science ----
  { compound: "General Peptide Science", title: "Safety and Efficacy of Approved and Unapproved Peptide Therapies for Musculoskeletal Injuries and Athletic Performance", authors: "Mendias CL, et al.", journal: "Sports Medicine", year: 2026, url: pm("41966639") },
  { compound: "General Peptide Science", title: "Injectable Peptide Therapy: A Primer for Orthopaedic and Sports Medicine Physicians", authors: "Mayfield CK, et al.", journal: "American Journal of Sports Medicine", year: 2026, url: pm("41476424") },
  { compound: "General Peptide Science", title: "Therapeutic Peptides in Aesthetic, Metabolic and Endocrine Conditions: Effects, Safety, Clinical Applications, and Future Perspectives", authors: "Renke G, et al.", journal: "International Journal of Molecular Sciences", year: 2026, url: pm("42123471") },
];
