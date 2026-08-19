import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description:
    "Partner with Vitality Certified Peptides: recurring commission on referred orders, a 30-day cookie window, monthly payouts, and clear compliance standards.",
  alternates: { canonical: "/affiliates" },
};

const terms = [
  "10% base commission on product subtotal (excl. shipping/tax/discounts)",
  "12% after $5,000 in lifetime referred sales; 15% after $15,000",
  "30-day cookie window, refreshed on most recent click",
  "$50 minimum payout, paid monthly on a net-30 schedule",
  "Approval-required enrollment, 24–48 hour review",
];

// Compliance attestation — every affiliate agrees to this at signup.
// Mitigates the single highest compliance risk called out in the GTM
// plan: a personal, first-person "this worked for me" benefit claim.
const complianceStandards = [
  "No description of any product in terms of what it does for a person who uses it, including personal testimonials (\"this worked for me,\" \"I felt X after using this\") or any first/second-person account of human use, benefit, or effect.",
  "No dosing information intended for human or animal administration, provided or linked to.",
  "No representation of any product as a drug, supplement, cosmetic, or treatment for any condition.",
  "Products described, if at all, only in terms of what has been studied or researched in published scientific literature, consistent with the language used across this site.",
  "No purchased or rented email lists, and compliance with CAN-SPAM and applicable state marketing law in any email promotion.",
  "Referral content is subject to review; violations may result in forfeiture of unpaid commission and removal from the program.",
];

// Traffic integrity / anti-fraud terms — every affiliate agrees to this
// at signup. Standard affiliate-program terms, not RUO-specific.
const trafficIntegrityStandards = [
  "No cookie stuffing or forced cookie drops — referral cookies are set only when a visitor knowingly and directly clicks an affiliate link, never via hidden iframes, pop-unders, auto-redirects, pre-checked boxes, browser extensions, or adware.",
  "No incentivized or misleading clicks — no paying, rewarding, or otherwise inducing anyone to click a referral link, and no misleading a visitor about what clicking will do.",
  "No bot or click-farm traffic — no automated, non-human traffic sources of any kind.",
  "No bidding on \"Vitality Certified Peptides,\" \"VCP,\" or confusingly similar terms/misspellings in paid search without prior written approval.",
  "Traffic sources disclosed at application, with material changes reported afterward.",
  "Referrals must come from an audience, platform, or channel the affiliate actually operates — not traffic purchased or aggregated from unrelated third parties, and not traffic redirected from other affiliates' links.",
  "Vitality Certified Peptides may audit referral traffic and order patterns at any time. Commission tied to a violation is reversed, and repeated or intentional violations result in immediate termination without payout of pending commission.",
];

const steps = [
  {
    title: "Apply",
    body: "Tell us who you are and where your audience lives. Applications are reviewed individually, most within 24 to 48 hours.",
  },
  {
    title: "Share your link",
    body: "Approved partners receive a unique referral link. Any visitor who arrives through it is credited to you for a full 30 days.",
  },
  {
    title: "Get paid monthly",
    body: "Earn commission on every order your referrals place, including reorders through our Restock autoship program. Payouts run monthly.",
  },
];

export default function AffiliatesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Partner With Us</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-6">
        Affiliate Program
      </h1>

      <p className="text-ink-soft leading-relaxed mb-10">
        Vitality Certified Peptides supplies US-made, research-use-only
        compounds with batch documentation behind every vial and direct
        pricing every day. If your audience follows the peptide research
        space, that is an easy story to tell, and we built this program so
        you are rewarded for telling it well.
      </p>


      <h2 className="font-serif-display text-xl text-ink mb-5">How it works</h2>
      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-sm border border-line bg-white px-4 py-5">
            <p className="label-eyebrow text-[0.65rem] text-gold-deep mb-2">
              Step {i + 1}
            </p>
            <p className="font-medium text-ink mb-2">{step.title}</p>
            <p className="text-sm text-ink-soft leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif-display text-xl text-ink mb-3">Program terms</h2>
      <ul className="space-y-3 mb-10">
        {terms.map((term) => (
          <li key={term} className="flex items-start gap-3 text-ink-soft leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" aria-hidden />
            {term}
          </li>
        ))}
      </ul>

      <h2 className="font-serif-display text-xl text-ink mb-3">
        Compliance standards
      </h2>
      <p className="text-ink-soft leading-relaxed mb-4">
        Vitality Certified Peptides sells research-use-only (RUO) compounds.
        Every affiliate agrees to the following before receiving a referral
        link:
      </p>
      <ul className="space-y-3 mb-10">
        {complianceStandards.map((item) => (
          <li key={item} className="flex items-start gap-3 text-ink-soft leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <h2 className="font-serif-display text-xl text-ink mb-3">
        Traffic &amp; cookie integrity
      </h2>
      <p className="text-ink-soft leading-relaxed mb-4">
        Commission is only earned on referrals from a real visitor genuinely
        choosing to click an affiliate&apos;s link. Every affiliate agrees to the
        following before receiving a referral link:
      </p>
      <ul className="space-y-3 mb-10">
        {trafficIntegrityStandards.map((item) => (
          <li key={item} className="flex items-start gap-3 text-ink-soft leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <div className="rounded-sm bg-cream-soft border border-line px-5 py-5 text-center">
        <p className="text-ink-soft leading-relaxed mb-4">
          Ready to partner with us? Agreement to the standards above is a
          required step of the application.
        </p>
        <a
          href="https://vitalitycertifiedpeptides.tapfiliate.com/programs/vitalitycertifiedpeptides/signup/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full bg-gold-deep text-cream px-8 py-3.5 label-eyebrow text-[0.72rem] hover:bg-ink transition-colors"
        >
          Apply to the Program
        </a>
      </div>
    </div>
  );
}
