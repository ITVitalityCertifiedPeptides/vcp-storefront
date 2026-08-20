import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Vitality Certified Peptides collects, uses, and protects your information.",
  alternates: { canonical: "/privacy-policy" },
};

// First-pass legal language for launch. Flagged for attorney review per
// the Legal Brief; update in place when counsel's edits come back.
const sections: Array<{ heading: string; body: string }> = [
  {
    heading: "Information you provide",
    body: "When you create an account, place an order, join our priority list, or contact support, we collect the information you give us: name, email address, phone number, shipping address, order details, and the contents of your messages. We do not collect or store full payment credentials on this site; payment is arranged by invoice through the payment channels described at checkout.",
  },
  {
    heading: "Information collected automatically",
    body: "Like most websites, we receive standard technical information when you visit: IP address, browser and device type, pages viewed, and referring links. We use privacy-respecting analytics to understand aggregate site usage. If you arrive through an affiliate's referral link, a cookie records that referral for 30 days so the affiliate can be credited; it identifies the referral, not your identity.",
  },
  {
    heading: "How we use information",
    body: "We use your information to process and fulfill orders, send order confirmations, invoices, and shipping updates, respond to support requests, maintain your account, credit affiliate referrals, send priority-list emails you signed up for, prevent fraud and abuse, and comply with legal obligations, including our record-keeping and state shipping restrictions.",
  },
  {
    heading: "How information is shared",
    body: "We do not sell your personal information. We share it only with the service providers who make the store work: our commerce platform (Swell), shipping carriers and our shipping software (ShipStation), our email provider for the messages described above, and our affiliate-tracking provider (Tapfiliate) for referral credit. Each receives only what it needs for its function. We may also disclose information when required by law or to protect our legal rights.",
  },
  {
    heading: "Cookies",
    body: "We use cookies and similar technologies for core site functions: keeping your cart and sign-in session, remembering your research-use acknowledgment for the visit, analytics, and the 30-day affiliate referral cookie described above. Your browser's settings let you limit or clear cookies; core store functions may not work without them.",
  },
  {
    heading: "Retention and security",
    body: "We keep order and account records as long as needed for the purposes above and for legal, tax, and compliance requirements, then delete or anonymize them. Information is transmitted over encrypted connections and access is limited to personnel who need it.",
  },
  {
    heading: "Your choices and rights",
    body: "You can unsubscribe from marketing email at any time via the link in each message. You can access or update account details on your account page. You may request a copy or deletion of your personal information by emailing us; California residents may exercise their rights under the CCPA, including the rights to know, delete, and correct, by the same route. We do not discriminate against anyone for exercising privacy rights.",
  },
  {
    heading: "Age",
    body: "This site is intended for qualified researchers who are at least 21 years of age. We do not knowingly collect information from anyone under 21, and we delete any such information we discover.",
  },
  {
    heading: "Changes and contact",
    body: "We may update this policy from time to time; the current version is always posted here with its date. Questions or requests: info@vitalitycertifiedpeptides.com.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Legal</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">
        Privacy Policy
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
    </div>
  );
}
