import Image from "next/image";
import Link from "next/link";
import { getAllCategories, categorySlug, displayCategory } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import { isApprovedResearcher } from "@/lib/current-session";
import FooterSignup from "./FooterSignup";

export default async function SiteFooter() {
  const approved = await isApprovedResearcher();
  const categories = approved ? await getAllCategories() : [];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream mt-20">
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
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
          {approved ? (
            <>
              <div className="label-eyebrow text-gold mb-3">Research Areas</div>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/categories/${categorySlug(category)}`}
                      className="text-cream/70 hover:text-cream transition-colors"
                    >
                      {displayCategory(category)}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            // Researcher-gate (2026-08-27): no category names for logged-out
            // visitors - a Get Access column instead of the catalog list.
            <>
              <div className="label-eyebrow text-gold mb-3">Get Access</div>
              <ul className="space-y-2">
                <li>
                  <Link href="/register" className="text-cream/70 hover:text-cream transition-colors">
                    Register as a Researcher
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-cream/70 hover:text-cream transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </>
          )}
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
              <Link
                href="/research"
                className="text-cream/70 hover:text-cream transition-colors"
              >
                Research Library
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-cream/70 hover:text-cream transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/affiliates" className="text-cream/70 hover:text-cream transition-colors">
                Affiliate Program
              </Link>
            </li>
            <li>
              <a
                href="mailto:info@vitalitycertifiedpeptides.com?subject=Wholesale%20Inquiry"
                className="text-cream/70 hover:text-cream transition-colors"
              >
                Wholesale Inquiries
              </a>
            </li>
          </ul>
          <p className="text-cream/45 text-xs leading-relaxed mt-4">
            A digital Certificate of Analysis is delivered with every
            order&apos;s shipping confirmation.
          </p>
        </div>
        <div>
          <div className="label-eyebrow text-gold mb-3">Legal</div>
          <ul className="space-y-2">
            {[
              ["/privacy-policy", "Privacy Policy"],
              ["/liability-waiver", "Liability Waiver"],
              ["/refund-returns", "Refund and Returns"],
              ["/terms-of-service", "Terms of Service"],
              ["/support", "Support Center"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-cream/70 hover:text-cream transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* FDA disclaimer: the standard research-supplier statement,
          rendered above the copyright row on every page. */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-cream/40 text-[0.72rem] leading-relaxed">
            The statements made on this website have not been evaluated by
            the U.S. Food and Drug Administration. The products offered by
            Vitality Certified Peptides are not intended to diagnose,
            treat, cure, or prevent any disease. All products are chemical
            reagents intended for laboratory research use only and are not
            for human use. We do not sell to patients. Vitality Certified
            Peptides is a chemical supplier. Vitality Certified Peptides is
            not a compounding pharmacy or chemical compounding facility as
            defined under Section 503A of the Federal Food, Drug, and
            Cosmetic Act, and is not an outsourcing facility as defined
            under Section 503B of the Federal Food, Drug, and Cosmetic Act.
            Please review our <Link href="/terms-of-service" className="underline underline-offset-2 hover:text-cream/70">Terms of Service</Link> before
            ordering.
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
