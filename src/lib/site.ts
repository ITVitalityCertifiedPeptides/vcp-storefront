export const siteConfig = {
  name: "Vitality Certified Peptides",
  shortName: "VCP",
  // Canonical host is www (the apex 308-redirects to it in Vercel), so
  // canonical URLs, the sitemap, and JSON-LD must all use www — pointing
  // them at the redirecting apex wastes crawl signals.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.vitalitycertifiedpeptides.com",
  description:
    "Research-grade peptides and compounds for laboratory research use only. Full Certificate of Analysis on every lot. Not for human or veterinary use.",
  legalName: "Vitality Certified Peptides",
};

export const ruoNotice =
  "All products sold by Vitality Certified Peptides are intended strictly for laboratory research use only (RUO). They are not drugs, dietary supplements, cosmetics, or foods, and are not for human or veterinary use, diagnostic use, or any use governed by the FD&C Act. These products have not been evaluated by the FDA for safety or efficacy in humans or animals. By purchasing, the buyer certifies that they are at least 21 years of age and a researcher, laboratory, institution, or other qualified party, whether independent or affiliated, acquiring these products solely for research or laboratory analysis, and assumes full responsibility for lawful handling, storage, and use in compliance with all applicable federal, state, and local laws. Every lot ships with a Certificate of Analysis.";

// Generic, compliance-safe FAQ content reused on every product page.
// Deliberately answers logistics/verification questions, not "what does
// this do for me" questions - stays inside the GTM doc's studied/researched
// framing and gives search engines FAQPage-eligible content without any
// benefit-claim risk. productName is interpolated into each answer.
export function productFaqItems(productName: string) {
  return [
    {
      question: "How is the purity of each lot verified?",
      answer: `Every lot of ${productName} we sell has a lot-specific Certificate of Analysis (COA) verifying identity and purity for that batch. A digital copy is sent with your tracking when your order ships.`,
    },
    {
      question: "What comes with an order?",
      answer:
        "Each order includes the product as listed, packaged for laboratory use, along with access to that lot's Certificate of Analysis. No dosing instructions, administration guidance, or human-use directions are provided with any order.",
    },
    {
      question: "Who can purchase from Vitality Certified Peptides?",
      answer:
        "Qualified researchers of every kind, including independent researchers, who are at least 21 years of age. You do not need to represent a lab or institution; every purchase is for laboratory research use only, in compliance with applicable federal, state, and local law.",
    },
  ];
}

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
    body: "By placing an order, the buyer represents and certifies that: (a) they are at least 21 years of age; (b) they are a researcher, laboratory, institution, or other party qualified to handle research chemicals, whether independent or affiliated; (c) the products will be used solely for legitimate research or laboratory purposes; (d) the products will not be resold, repackaged, or distributed for human or veterinary consumption; and (e) they will comply with all applicable federal, state, and local laws governing the purchase, possession, and use of research chemicals in their jurisdiction.",
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
