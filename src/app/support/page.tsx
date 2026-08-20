import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Support Center",
  description:
    "Contact Vitality Certified Peptides customer support: order questions, COAs, shipping, refunds, and account help.",
  alternates: { canonical: "/support" },
};

const quickLinks = [
  { label: "Research Use Only Policy", href: "/ruo-policy", note: "Who can buy, buyer certifications, and the states we do not sell to." },
  { label: "Refund and Returns", href: "/refund-returns", note: "Damaged or incorrect orders, cancellations, and our quality guarantee." },
  { label: "Quality Assurance", href: "/quality-assurance", note: "How every lot is tested and documented." },
  { label: "Lab Results", href: "/lab-results", note: "Certificates of Analysis by lot." },
  { label: "Your Account", href: "/account", note: "Order history, tracking, saved shipping details, and autoship." },
  { label: "Terms of Service", href: "/terms-of-service", note: "The terms that govern every order." },
];

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Here to Help</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-6">
        Support Center
      </h1>
      <p className="text-ink-soft leading-relaxed mb-10">
        Questions about an order, an invoice, a Certificate of Analysis, or
        anything else? A real person reads every message.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <div className="rounded-sm border border-line bg-white px-5 py-5">
          <Mail className="h-5 w-5 text-gold-deep mb-3" aria-hidden />
          <p className="font-medium text-ink mb-1.5">Email us</p>
          <a
            href="mailto:info@vitalitycertifiedpeptides.com"
            className="text-sm text-gold-deep hover:underline underline-offset-4 break-all"
          >
            info@vitalitycertifiedpeptides.com
          </a>
          <p className="text-xs text-ink-soft mt-2 leading-relaxed">
            Include your order number for the fastest help.
          </p>
        </div>
        <div className="rounded-sm border border-line bg-white px-5 py-5">
          <Clock className="h-5 w-5 text-gold-deep mb-3" aria-hidden />
          <p className="font-medium text-ink mb-1.5">Response time</p>
          <p className="text-sm text-ink-soft leading-relaxed">
            Usually within 1 business day, Monday through Friday.
          </p>
        </div>
      </div>

      <h2 className="font-serif-display text-xl text-ink mb-5 flex items-center gap-2.5">
        <FileText className="h-5 w-5 text-gold-deep" aria-hidden />
        Answers to common questions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-sm border border-line bg-white px-5 py-4 hover:border-gold-deep transition-colors block"
          >
            <p className="font-medium text-ink mb-1">{link.label}</p>
            <p className="text-xs text-ink-soft leading-relaxed">{link.note}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
