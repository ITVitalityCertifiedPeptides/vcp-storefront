import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Vitality Certified Peptides: eligibility, research use only restrictions, ordering, shipping, and legal terms.",
  alternates: { canonical: "/terms-of-service" },
};

// First-pass legal language for launch. Flagged for attorney review per
// the Legal Brief; update in place when counsel's edits come back.
const sections: Array<{ heading: string; body: string }> = [
  {
    heading: "1. Acceptance of these terms",
    body: "These Terms of Service govern your access to and use of the Vitality Certified Peptides website and your purchase of any product from it. By using this site or placing an order, you agree to these terms, our Research Use Only Policy, our Liability Waiver, our Refund and Returns Policy, and our Privacy Policy. If you do not agree, do not use this site or purchase from it.",
  },
  {
    heading: "2. Eligibility",
    body: "You must be at least 21 years of age and a researcher, laboratory, institution, or other party qualified to handle research chemicals, whether independent or affiliated, to purchase from this site. By ordering, you represent and certify that you meet these requirements.",
  },
  {
    heading: "3. Research use only",
    body: "Every product sold on this site is a chemical reagent intended strictly for laboratory research use. No product is a drug, dietary supplement, cosmetic, food, or medical device, and no product may be used for human or veterinary administration, diagnostic procedures, or incorporation into any product intended for human or animal use. Purchases are subject to the buyer certifications in our Research Use Only Policy, which is incorporated into these terms.",
  },
  {
    heading: "4. State restrictions",
    body: "We do not sell or ship to certain states, as listed in our Research Use Only Policy. Orders with a shipping address in a restricted state cannot be fulfilled and will be canceled and refunded. You are responsible for confirming that receiving the products you order is lawful at your shipping address.",
  },
  {
    heading: "5. Ordering and payment",
    body: "Placing an order constitutes an offer to purchase. Orders are confirmed as pending payment; we send an invoice with payment instructions, and your order ships after payment is confirmed. We may refuse, limit, or cancel any order at our discretion, including orders we believe violate these terms. Prices are in US dollars and may change at any time before an order is accepted.",
  },
  {
    heading: "6. Shipping",
    body: "We ship within the United States only, excluding restricted states. In-stock orders ship within 1 business day after payment is confirmed, with tracking. Risk of loss passes to you on delivery of the package to the carrier. Shipping timelines are estimates, not guarantees.",
  },
  {
    heading: "7. Returns and refunds",
    body: "Returns and refunds are governed by our Refund and Returns Policy. Because product integrity cannot be assured once a compound leaves our control, shipped compounds are not returnable except as that policy provides.",
  },
  {
    heading: "8. Certificates of Analysis",
    body: "Each lot is tested by an independent laboratory and accompanied by a Certificate of Analysis addressing identity, purity, and net content of that lot. A COA is a statement about the chemical characteristics of a lot; it is not a representation of safety, efficacy, or fitness for any use in any biological system.",
  },
  {
    heading: "9. Intellectual property",
    body: "All content on this site, including text, images, product photography, and design, is the property of Vitality Certified Peptides or its licensors and is protected by applicable intellectual-property law. You may not reproduce or distribute it without our prior written permission.",
  },
  {
    heading: "10. Acceptable use",
    body: "You agree not to misuse this site, including by attempting to interfere with its operation, submitting false ordering or attestation information, purchasing on behalf of an ineligible party, or reselling, repackaging, or distributing products for human or veterinary consumption.",
  },
  {
    heading: "11. Disclaimers",
    body: "Products are provided as-is for research purposes. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. Nothing on this site is medical, legal, or regulatory advice.",
  },
  {
    heading: "12. Limitation of liability",
    body: "To the fullest extent permitted by law, Vitality Certified Peptides and its owners, employees, and suppliers are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of this site or any product, and our total liability for any claim is limited to the amount you paid for the product giving rise to the claim.",
  },
  {
    heading: "13. Indemnification",
    body: "You agree to indemnify and hold harmless Vitality Certified Peptides and its owners, employees, and suppliers from any claim, loss, or expense, including reasonable attorneys' fees, arising from your breach of these terms, your misuse of any product, or your violation of any law in connection with your purchase, possession, handling, or use of any product.",
  },
  {
    heading: "14. Governing law",
    body: "These terms are governed by the laws of the State of California, without regard to conflict-of-law principles. Any dispute arising from these terms or your use of this site will be resolved in the state or federal courts located in California, and you consent to their jurisdiction.",
  },
  {
    heading: "15. Changes to these terms",
    body: "We may update these terms from time to time. The version posted on this page at the time you place an order governs that order. Continued use of the site after changes are posted constitutes acceptance of the updated terms.",
  },
  {
    heading: "16. Contact",
    body: "Questions about these terms can be sent to info@vitalitycertifiedpeptides.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Legal</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">
        Terms of Service
      </h1>
      <p className="text-sm text-ink-soft mb-10">Last updated: August 19, 2026</p>

      {sections.map((section) => (
        <div key={section.heading} className="mb-7">
          <h2 className="font-serif-display text-lg text-ink mb-2">
            {section.heading}
          </h2>
          <p className="text-ink-soft leading-relaxed text-[0.95rem]">{section.body}</p>
        </div>
      ))}

      <p className="text-sm text-ink-soft mt-10">
        Related:{" "}
        <Link href="/ruo-policy" className="text-gold-deep hover:underline underline-offset-4">
          Research Use Only Policy
        </Link>
        ,{" "}
        <Link href="/liability-waiver" className="text-gold-deep hover:underline underline-offset-4">
          Liability Waiver
        </Link>
        ,{" "}
        <Link href="/refund-returns" className="text-gold-deep hover:underline underline-offset-4">
          Refund and Returns
        </Link>
        ,{" "}
        <Link href="/privacy-policy" className="text-gold-deep hover:underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
