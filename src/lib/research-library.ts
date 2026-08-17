// Research literature library: a neutral bibliography of published,
// peer-reviewed papers involving compounds in the catalog. RULES for
// every entry, per the legal brief's content boundaries:
//  - Real, verified citations only (check the DOI/PubMed link resolves
//    and matches title/journal/year before adding).
//  - Title, authors, journal, year, link. NO summaries of effects, no
//    benefit framing, no dosing detail, no editorializing.
//  - The page-level disclaimer (below) frames the whole section.

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

export const researchLibrary: ResearchEntry[] = [
  {
    compound: "BPC-157",
    title:
      "The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration",
    authors: "Chang CH, Tsai WC, Lin MS, Hsu YH, Pang JHS",
    journal: "Journal of Applied Physiology",
    year: 2011,
    url: "https://pubmed.ncbi.nlm.nih.gov/21030672/",
  },
  {
    compound: "BPC-157",
    title:
      "Emerging Use of BPC-157 in Orthopaedic Sports Medicine: A Systematic Review",
    authors: "See PubMed listing",
    journal: "PubMed-indexed systematic review",
    year: 2025,
    url: "https://pubmed.ncbi.nlm.nih.gov/40756949/",
  },
  {
    compound: "Tirzepatide",
    title:
      "Tirzepatide versus Semaglutide Once Weekly in Patients with Type 2 Diabetes (SURPASS-2)",
    authors: "Frias JP, Davies MJ, Rosenstock J, et al.",
    journal: "New England Journal of Medicine",
    year: 2021,
    url: "https://pubmed.ncbi.nlm.nih.gov/34170647/",
  },
  {
    compound: "Tirzepatide",
    title: "Tirzepatide Once Weekly for the Treatment of Obesity (SURMOUNT-1)",
    authors: "Jastreboff AM, Aronne LJ, Ahmad NN, et al.",
    journal: "New England Journal of Medicine",
    year: 2022,
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038",
  },
  {
    compound: "Retatrutide",
    title:
      "Triple-Hormone-Receptor Agonist Retatrutide for Obesity: A Phase 2 Trial",
    authors: "Jastreboff AM, Kaplan LM, Frias JP, et al.",
    journal: "New England Journal of Medicine",
    year: 2023,
    url: "https://pubmed.ncbi.nlm.nih.gov/37366315/",
  },
];
