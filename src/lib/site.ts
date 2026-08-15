export const siteConfig = {
  name: "Vitality Certified Peptides",
  shortName: "VCP",
  // Placeholder until the GoDaddy domain is connected to this Vercel deployment.
  // Update this the moment the real domain goes live — it feeds canonical URLs,
  // the sitemap, and JSON-LD, all of which matter for SEO.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vitalitycertifiedpeptides.com",
  description:
    "Research-grade peptides and compounds for laboratory research use only. Full Certificate of Analysis on every lot. Not for human or veterinary use.",
  legalName: "Vitality Certified Peptides",
};

export const ruoNotice =
  "All products sold by Vitality Certified Peptides are intended strictly for laboratory research use only (RUO). They are not drugs, dietary supplements, cosmetics, or foods, and are not for human or veterinary use, diagnostic use, or any use governed by the FD&C Act. These products have not been evaluated by the FDA for safety or efficacy in humans or animals. By purchasing, the buyer certifies that they are a qualified professional, laboratory, or institution acquiring these products solely for research or laboratory analysis, and assumes full responsibility for lawful handling, storage, and use in compliance with all applicable federal, state, and local laws. Every lot ships with a Certificate of Analysis.";

// Long-form RUO policy content for the /ruo-policy page, split into
// sections so the page can render each as its own heading + paragraph.
export const ruoPolicySections = [
  {
    heading: "Intended use",
    body: "Every compound sold by Vitality Certified Peptides is intended exclusively for laboratory research, analytical testing, or other non-clinical research applications by qualified professionals. No product sold on this site is intended for human consumption, human or veterinary administration, diagnostic use, or incorporation into any product regulated under the Food, Drug, and Cosmetic Act.",
  },
  {
    heading: "No clinical or consumer claims",
    body: "Nothing on this site should be construed as a recommendation, suggestion, or instruction for human or animal use. Any reference to a compound's biological activity describes findings reported in published research literature, not an effect the buyer should expect from using the product. This site does not provide dosing information for human or animal administration under any circumstance.",
  },
  {
    heading: "Buyer eligibility and certification",
    body: "By placing an order, the buyer represents and certifies that: (a) they are purchasing on behalf of a laboratory, research institution, or other entity qualified to handle research chemicals; (b) the products will be used solely for legitimate research or laboratory purposes; (c) the products will not be resold, repackaged, or distributed for human or veterinary consumption; and (d) they will comply with all applicable federal, state, and local laws governing the purchase, possession, and use of research chemicals in their jurisdiction.",
  },
  {
    heading: "No warranty of fitness for human use",
    body: "Vitality Certified Peptides makes no representation, express or implied, regarding the safety, efficacy, or suitability of any product for human or animal use. Products are supplied \"as is\" for research purposes, accompanied by a Certificate of Analysis addressing identity and purity of the lot, not safety or efficacy in any biological system.",
  },
  {
    heading: "Regulatory status",
    body: "These products have not been approved, cleared, or evaluated by the U.S. Food and Drug Administration or any other regulatory body for use in humans or animals. They are not intended to diagnose, treat, cure, or prevent any disease.",
  },
];
