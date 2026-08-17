import { faqSchema } from "@/lib/schema";
import { productFaqItems } from "@/lib/site";

// Renders the shared, compliance-safe FAQ content for a product page and
// injects matching FAQPage JSON-LD so search engines are eligible to show
// it as a rich result. Content lives in src/lib/site.ts so it stays
// consistent across every product instead of being hand-written per page.
export default function ProductFaq({ productName }: { productName: string }) {
  const items = productFaqItems(productName);

  return (
    <section className="max-w-3xl mx-auto px-4 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(items)) }}
      />
      <p className="label-eyebrow text-gold-deep mb-3">Frequently asked questions</p>
      <dl className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <div key={item.question} className="py-5">
            <dt className="font-medium text-ink mb-2">{item.question}</dt>
            <dd className="text-ink-soft leading-relaxed text-sm">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
