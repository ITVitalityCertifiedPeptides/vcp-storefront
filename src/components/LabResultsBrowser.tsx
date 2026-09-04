"use client";

// Client-side search for the public Lab Results library (see
// src/app/lab-results/page.tsx). The page still does the server-side
// work of reading public/coas/ at request time; this component just
// makes that full list searchable by product name or lot number instead
// of only browsable. Styling/pattern matches ResearchLibraryBrowser.

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export type LotEntry = {
  slug: string;
  lot: string;
  file: string;
  productName: string;
};

export default function LabResultsBrowser({ lots }: { lots: LotEntry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lots;
    return lots.filter(
      (lot) =>
        lot.productName.toLowerCase().includes(q) ||
        lot.lot.toLowerCase().includes(q)
    );
  }, [lots, query]);

  const inputClass =
    "rounded-sm border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-gold-deep";

  return (
    <div>
      <div className="relative mb-4">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft/60"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by product name or lot number..."
          aria-label="Search Certificates of Analysis"
          className={`${inputClass} w-full pl-10`}
        />
      </div>
      <p className="text-xs text-ink-soft mb-4">
        Showing {filtered.length} of {lots.length} reports.
      </p>

      {filtered.length === 0 ? (
        <p className="text-ink-soft">
          No reports match that search. Try a different product name or lot
          number, or contact us for a Certificate of Analysis for any lot.
        </p>
      ) : (
        <div className="border-y border-line divide-y divide-line">
          {filtered.map((lot) => (
            <div
              key={lot.file}
              className="py-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-medium text-ink">{lot.productName}</p>
                <p className="text-sm text-ink-soft font-mono mt-0.5">
                  Lot {lot.lot}
                </p>
              </div>
              <a
                href={`/coas/${lot.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-gold-deep/40 text-gold-deep px-4 py-2 label-eyebrow text-[0.65rem] hover:bg-gold-deep hover:text-cream transition-colors shrink-0"
              >
                View Report
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
