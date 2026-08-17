import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { researchLibrary, libraryDisclaimer } from "@/lib/research-library";

export const metadata: Metadata = {
  title: "Research Library",
  description:
    "A catalog of published, peer-reviewed scientific literature involving research peptides and compounds, with links to the original publications.",
  alternates: { canonical: "/research" },
};

export default function ResearchLibraryPage() {
  const compounds = Array.from(
    new Set(researchLibrary.map((entry) => entry.compound))
  ).sort();

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Research Library</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-6">
        The published literature, cataloged.
      </h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        Peer-reviewed publications involving compounds in our catalog, listed
        with links to the original sources. The library grows as new
        literature is published and verified.
      </p>

      <div className="rounded-sm bg-cream-soft border border-line px-5 py-4 mb-12">
        <p className="text-xs text-ink-soft leading-relaxed">{libraryDisclaimer}</p>
      </div>

      {compounds.map((compound) => (
        <section key={compound} className="mb-10">
          <h2 className="font-serif-display text-xl text-ink mb-4">{compound}</h2>
          <ul className="space-y-4">
            {researchLibrary
              .filter((entry) => entry.compound === compound)
              .sort((a, b) => b.year - a.year)
              .map((entry) => (
                <li key={entry.url} className="border-l-2 border-gold/40 pl-4">
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-ink hover:text-gold-deep transition-colors inline-flex items-start gap-1.5"
                  >
                    <span>{entry.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 mt-1 shrink-0" aria-hidden />
                  </a>
                  <p className="text-sm text-ink-soft mt-1">
                    {entry.authors}. {entry.journal}, {entry.year}.
                  </p>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
