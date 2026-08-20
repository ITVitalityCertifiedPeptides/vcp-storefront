import type { Metadata } from "next";
import Image from "next/image";
import { researchLibrary, libraryDisclaimer } from "@/lib/research-library";
import ResearchLibraryBrowser from "@/components/ResearchLibraryBrowser";

export const metadata: Metadata = {
  title: "Research Library",
  description:
    "A growing catalog of published, peer-reviewed scientific literature involving research peptides and compounds, with links to the original publications on PubMed.",
  alternates: { canonical: "/research" },
};

// Screenshot thumbnails live in public/trusted/ (home-page captures,
// refreshed occasionally). Same source list as the header dropdown.
const trustedSources = [
  {
    name: "PubMed",
    url: "https://pubmed.ncbi.nlm.nih.gov/",
    image: "/trusted/pubmed.jpg",
    note: "40+ million biomedical citations from MEDLINE and life science journals. Every entry in our library links to its PubMed record.",
  },
  {
    name: "PubChem",
    url: "https://pubchem.ncbi.nlm.nih.gov/",
    image: "/trusted/pubchem.jpg",
    note: "The world's largest open chemistry database: structures, formulas, CAS numbers, and properties for every compound we carry.",
  },
  {
    name: "ClinicalTrials.gov",
    url: "https://clinicaltrials.gov/",
    image: "/trusted/clinicaltrials.jpg",
    note: "The registry of clinical studies worldwide, for tracing how a compound has been studied.",
  },
  {
    name: "Europe PMC",
    url: "https://europepmc.org/",
    image: "/trusted/europepmc.jpg",
    note: "48+ million life-science articles and preprints, searchable free, partnered with PubMed Central.",
  },
  {
    name: "Google Scholar",
    url: "https://scholar.google.com/",
    image: "/trusted/google-scholar.jpg",
    note: "Broad academic search across disciplines, useful for citation trails and full-text hunting.",
  },
];

export default function ResearchLibraryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="font-serif-display text-3xl md:text-4xl text-ink mb-8">
        Research Library
      </h1>

      <div className="rounded-sm bg-cream-soft border border-line px-5 py-4 mb-10">
        <p className="text-xs text-ink-soft leading-relaxed">{libraryDisclaimer}</p>
      </div>

      <ResearchLibraryBrowser entries={researchLibrary} />

      <section className="mt-16 border-t border-line pt-12">
        <h2 className="font-serif-display text-2xl text-ink mb-3">
          Trusted Sources
        </h2>
        <p className="text-ink-soft leading-relaxed mb-8">
          Every citation in this library is verifiable at the source. These
          are the databases we use and recommend for going deeper.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {trustedSources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-sm border border-line bg-white overflow-hidden hover:border-gold-deep transition-colors"
            >
              <div className="relative aspect-[16/10] bg-cream-soft border-b border-line">
                <Image
                  src={source.image}
                  alt={`${source.name} home page`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="px-5 py-4">
                <p className="font-medium text-ink group-hover:text-gold-deep transition-colors">
                  {source.name} &#8599;
                </p>
                <p className="text-xs text-ink-soft leading-relaxed mt-1.5">
                  {source.note}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
