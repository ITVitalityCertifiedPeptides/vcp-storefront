import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Received",
  robots: { index: false, follow: false },
};

export default function PendingApprovalPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-4">
        Application Received
      </h1>
      <p className="text-ink-soft text-sm leading-relaxed mb-8">
        Thanks for registering. Our team reviews every researcher account
        by hand, and you&rsquo;ll get an email as soon as yours is
        approved - usually within one business day. Once approved, come
        back and sign in to see our full catalog and pricing.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-full bg-ink text-cream px-7 py-3 label-eyebrow text-[0.68rem] hover:bg-gold-deep transition-colors"
      >
        Sign In
      </Link>
    </div>
  );
}
