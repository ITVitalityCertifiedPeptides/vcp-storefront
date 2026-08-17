import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { researchLibrary, libraryDisclaimer } from "@/lib/research-library";

export const metadata: Metadata = {
  title: "Research Library",
  description:
    "A growing catalog of published, peer-reviewed scientific literature involving research peptides and compounds, with links to the original publications on PubMed.",
  alternates: { canonical: "/research" },
};

function anchor(compound: string): string {
  return compound
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ResearchLibraryPage() {
  const compounds = Array.from(
    new Set(researchLibrary.map((entry) => entry.compound))
  ).sort((a, b) =>
    a === "General Peptide Science" ? 1 : b === "General Peptide Science" ? -1 : a.localeCompare(b)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <p className="label-eyebrow text-gold-deep mb-2">Research Library</p>
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-6">
        The published literature, cataloged.
      </h1>
      <p className="text-ink-soft leading-relaxed mb-8">
        {researchLibrary.length} peer-reviewed publications involving
        compounds in our catalog, each linked to its original source on
        PubMed or the publishing journal. The library grows as new
        literature is published and verified.
      </p>

      <div className="rounded-sm bg-cream-soft border border-line px-5 py-4 mb-10">
        <p className="text-xs text-ink-soft leading-relaxed">{libraryDisclaimer}</p>
      </div>

      {/* Jump navigation */}
      <div className="flex flex-wrap gap-2 mb-12">
        {compounds.map((compound) => (
          <a
            key={compound}
            href={`#${anchor(compound)}`}
            className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink hover:border-gold-deep hover:text-gold-deep transition-colors"
          >
            {compound}
          </a>
        ))}
      </div>

      {compounds.map((compound) => (
        <section
          key={compound}
          id={anchor(compound)}
          className="mb-12 scroll-mt-28"
        >
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
                    {entry.authors} {entry.journal}, {entry.year}.
                  </p>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
