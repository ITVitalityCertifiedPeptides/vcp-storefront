import Link from "next/link";

// Researcher-gate (2026-08-28): shown in place of <BuyBox> on a product
// page for anyone not signed in as an approved researcher/friends-family
// account - no price, no options, no Add to Cart. `returnTo` sends them
// straight back to this product after they sign in.
export default function SignInToBuy({ returnTo }: { returnTo: string }) {
  return (
    <div className="mb-8 rounded-sm border border-line bg-cream-soft px-5 py-5">
      <p className="font-medium text-ink mb-1.5">Sign in to see pricing &amp; purchase</p>
      <p className="text-sm text-ink-soft mb-4">
        Pricing and ordering are available to approved researchers. Registration
        is free and usually reviewed within one business day.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={`/login?return=${encodeURIComponent(returnTo)}`}
          className="inline-flex items-center justify-center rounded-full bg-gold-deep text-cream px-6 py-3 label-eyebrow text-[0.68rem] hover:bg-ink transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="label-eyebrow text-[0.68rem] text-ink-soft hover:text-gold-deep transition-colors"
        >
          Not registered? Request access
        </Link>
      </div>
    </div>
  );
}
