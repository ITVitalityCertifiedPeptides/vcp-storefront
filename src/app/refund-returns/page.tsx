import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund and Returns Policy",
  description:
    "Vitality Certified Peptides' refund and returns policy for research-use-only compounds.",
  alternates: { canonical: "/refund-returns" },
};

// First-pass legal language for launch. Flagged for attorney review per
// the Legal Brief; update in place when counsel's edits come back.
const sections: Array<{ heading: string; body: string }> = [
  {
    heading: "Why shipped compounds are not returnable",
    body: "Once a research compound leaves our control, its storage and handling can no longer be verified, so its integrity can no longer be assured. For that reason, shipped compounds cannot be returned for restocking or resale. This is standard practice for research chemical suppliers and protects every researcher who orders from us.",
  },
  {
    heading: "Damaged, incorrect, or missing items",
    body: "If your order arrives damaged, contains the wrong item, or is missing something, email us within 7 days of delivery with your order number and photos of what you received. We will replace the affected items or refund them in full, your choice. You do not need to ship anything back unless we specifically ask.",
  },
  {
    heading: "Our quality guarantee",
    body: "Every lot ships with an independent Certificate of Analysis. If a lot you purchased fails independent verification against its published COA for identity, purity, or net content, contact us with the supporting documentation and we will replace it or refund it in full.",
  },
  {
    heading: "Cancellations",
    body: "Orders are placed as pending payment and ship only after payment is confirmed. You can cancel any unpaid order at no cost by replying to your order confirmation. After payment but before shipment, we will cancel and refund in full. After shipment, the sections above apply.",
  },
  {
    heading: "Orders to restricted states",
    body: "Orders with a shipping address in a state we do not sell to (listed in our Research Use Only Policy) are canceled and refunded in full.",
  },
  {
    heading: "How refunds are issued",
    body: "Refunds are issued to the payment method used for the invoice, normally within 5 business days of approval. If that is not possible, we will contact you to arrange an alternative.",
  },
  {
    heading: "Contact",
    body: "For any refund or return matter, email customerservice@vitalitycertifiedpeptides.com with your order number. A real person replies, usually within 1 business day.",
  },
];

export default function RefundReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Legal</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-3">
        Refund and Returns Policy
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
