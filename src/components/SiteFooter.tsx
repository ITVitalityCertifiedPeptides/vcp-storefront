import Image from "next/image";
import Link from "next/link";
import { getAllCategories, categorySlug } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import FooterSignup from "./FooterSignup";

export default async function SiteFooter() {
  const categories = await getAllCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream mt-20">
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Image
              src="/emblem-512.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 opacity-90"
            />
            <span className="leading-none">
              <span className="block font-serif-display text-base tracking-wide">
                Vitality
              </span>
              <span className="block label-eyebrow text-[0.58rem] tracking-[0.2em] text-gold mt-0.5">
                Certified Peptides
              </span>
            </span>
          </div>
          <p className="text-cream/60 leading-relaxed">{siteConfig.description}</p>
          <FooterSignup />
        </div>
        <div>
          <div className="label-eyebrow text-gold mb-3">Categories</div>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/categories/${categorySlug(category)}`}
                  className="text-cream/70 hover:text-cream transition-colors"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="label-eyebrow text-gold mb-3">Trust &amp; Compliance</div>
          <ul className="space-y-2">
            <li>
              <Link href="/ruo-policy" className="text-cream/70 hover:text-cream transition-colors">
                RUO Policy
              </Link>
            </li>
            <li>
              <Link
                href="/quality-assurance"
                className="text-cream/70 hover:text-cream transition-colors"
              >
                Quality Assurance
              </Link>
            </li>
            <li>
              <Link
                href="/lab-results"
                className="text-cream/70 hover:text-cream transition-colors"
              >
                Lab Results
              </Link>
            </li>
            <li>
              <Link href="/affiliates" className="text-cream/70 hover:text-cream transition-colors">
                Affiliate Program
              </Link>
            </li>
          </ul>
          <p className="text-cream/45 text-xs leading-relaxed mt-4">
            A digital Certificate of Analysis is delivered with every
            order&apos;s shipping confirmation.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/50">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>For laboratory research use only. Not for human consumption.</p>
        </div>
      </div>
    </footer>
  );
}
