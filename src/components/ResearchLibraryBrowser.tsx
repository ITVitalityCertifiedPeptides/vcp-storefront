"use client";

// Interactive browser for the Research Library: a search box that filters
// citations live (title, authors, journal, compound) and a compound
// dropdown (replacing the old jump-link chips, per Josh). Both filters
// compose: pick a compound AND search within it.

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import type { ResearchEntry } from "@/lib/research-library";

export default function ResearchLibraryBrowser({
  entries,
}: {
  entries: ResearchEntry[];
}) {
  const [query, setQuery] = useState("");
  const [compound, setCompound] = useState("all");

  const compounds = useMemo(
    () =>
      Array.from(new Set(entries.map((entry) => entry.compound))).sort(
        (a, b) =>
          a === "General Peptide Science"
            ? 1
            : b === "General Peptide Science"
              ? -1
              : a.localeCompare(b)
      ),
    [entries]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (compound !== "all" && entry.compound !== compound) return false;
      if (!q) return true;
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.authors.toLowerCase().includes(q) ||
        entry.journal.toLowerCase().includes(q) ||
        entry.compound.toLowerCase().includes(q) ||
        String(entry.year).includes(q)
      );
    });
  }, [entries, query, compound]);

  const visibleCompounds = compounds.filter((c) =>
    filtered.some((entry) => entry.compound === c)
  );

  const inputClass =
    "rounded-sm border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-gold-deep";

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft/60"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, authors, journals..."
            aria-label="Search the research library"
            className={`${inputClass} w-full pl-10`}
          />
        </div>
        <select
          value={compound}
          onChange={(e) => setCompound(e.target.value)}
          aria-label="Filter by compound"
          className={`${inputClass} sm:w-64`}
        >
          <option value="all">All compounds</option>
          {compounds.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs text-ink-soft mb-10">
        Showing {filtered.length} of {entries.length} publications
        {compound !== "all" ? ` for ${compound}` : ""}.
      </p>

      {filtered.length === 0 && (
        <p className="text-ink-soft mb-12">
          No publications match that search. Try a different term, or clear
          the compound filter.
        </p>
      )}

      {visibleCompounds.map((c) => (
        <section key={c} className="mb-12">
          <h2 className="font-serif-display text-xl text-ink mb-4">{c}</h2>
          <ul className="space-y-4">
            {filtered
              .filter((entry) => entry.compound === c)
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
