import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <Image
        src="/emblem-512.png"
        alt=""
        width={64}
        height={64}
        className="h-14 w-14 mx-auto mb-6 opacity-70"
      />
      <p className="label-eyebrow text-gold-deep mb-2">404</p>
      <h1 className="font-serif-display text-3xl text-ink mb-4">Page not found</h1>
      <p className="text-ink-soft mb-8">
        The page you&apos;re looking for doesn&apos;t exist, or the product may no
        longer be active.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-sm bg-ink text-cream px-6 py-3 label-eyebrow text-[0.72rem] hover:bg-gold-deep transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
