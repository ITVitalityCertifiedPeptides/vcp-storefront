import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Liability Waiver",
  description:
    "Liability waiver governing the purchase and handling of research-use-only compounds from Vitality Certified Peptides.",
  alternates: { canonical: "/liability-waiver" },
};

// First-pass legal language for launch. Flagged for attorney review per
// the Legal Brief; update in place when counsel's edits come back.
const sections: Array<{ heading: string; body: string }> = [
  {
    heading: "Assumption of responsibility",
    body: "By purchasing from Vitality Certified Peptides, the buyer assumes full and sole responsibility for the lawful and proper transport, storage, handling, use, and disposal of every product purchased. Research chemicals require qualified handling; the buyer represents that they have the training, facilities, and procedures appropriate for the materials they order.",
  },
  {
    heading: "Research use only",
    body: "All products are chemical reagents sold strictly for laboratory research use. They are not for human or veterinary use of any kind. The buyer certifies that no product will be used in or on humans or animals, will not be used for diagnostic or therapeutic purposes, and will not be resold, repackaged, or distributed for any such use. The full buyer certifications are in our Research Use Only Policy, which this waiver incorporates.",
  },
  {
    heading: "No representations of safety or efficacy",
    body: "Vitality Certified Peptides makes no representation, express or implied, about the safety, efficacy, or suitability of any product for any use in any biological system. Certificates of Analysis address the identity, purity, and net content of a lot, nothing more. Any misuse of a product is against its intended use and entirely at the buyer's own risk.",
  },
  {
    heading: "Release and waiver",
    body: "To the fullest extent permitted by law, the buyer releases and forever discharges Vitality Certified Peptides and its owners, employees, contractors, and suppliers from any and all claims, liabilities, damages, and causes of action arising out of or related to the buyer's purchase, possession, transport, storage, handling, use, misuse, or disposal of any product.",
  },
  {
    heading: "Indemnification",
    body: "The buyer agrees to defend, indemnify, and hold harmless Vitality Certified Peptides and its owners, employees, contractors, and suppliers from any claim, demand, loss, or expense, including reasonable attorneys' fees, brought by any party and arising out of the buyer's breach of this waiver, violation of any law, or possession, handling, use, or misuse of any product.",
  },
  {
    heading: "Acceptance",
    body: "Placing an order on this site constitutes the buyer's acceptance of this waiver in full, together with the Terms of Service and Research Use Only Policy. If you do not accept this waiver, do not purchase from this site.",
  },
];

export default function LiabilityWaiverPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Legal</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">
        Liability Waiver
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
        <Link href="/terms-of-service" className="text-gold-deep hover:underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/ruo-policy" className="text-gold-deep hover:underline underline-offset-4">
          Research Use Only Policy
        </Link>
        .
      </p>
    </div>
  );
}
