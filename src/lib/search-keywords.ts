// Search matching shared by the header dropdown and the /search page.
//
// 2026-09-14 (Josh): "when you use the search function it doesn't find
// them" - GLOW / KLOW (and the other blends) only matched on their own
// name, so typing a compound like GHK-Cu or BPC-157 returned nothing.
// Every product now gets a keyword string built from its name, its
// description, and a small alias table for blends whose name doesn't
// spell out the compounds. Matching ignores case and punctuation, so
// "bpc157", "bpc 157" and "BPC-157" all hit the same products.

const BLEND_ALIASES: Array<[RegExp, string]> = [
  [/\bglow\b/i, "GLOW GHK-Cu BPC-157 TB-500 copper peptide blend"],
  [/\bklow\b/i, "KLOW GHK-Cu BPC-157 TB-500 KPV copper peptide blend"],
  [/deadpool|bpc-157\s*\/\s*tb-500\s*\/\s*cartalax/i, "Deadpool BPC-157 TB-500 Cartalax blend"],
  [/beauty blend|ghk-cu\s*\/\s*kpv/i, "Beauty Blend GHK-Cu KPV"],
  [/gut blend|larazotide/i, "Gut Blend BPC-157 KPV Larazotide"],
  [/wolverine/i, "Wolverine BPC-157 TB-500 nasal spray"],
  [/bpc-157\s*\/\s*tb-500/i, "BPC-157 TB-500 blend"],
  [/cjc-1295\s*\/\s*ipamorelin|cjc-1295\s*\+\s*ipamorelin/i, "CJC-1295 Ipamorelin blend"],
  [/tesamorelin\s*\/\s*ipamorelin/i, "Tesamorelin Ipamorelin blend"],
  [/semax\s*\/\s*selank|selank\s*\+\s*semax/i, "Semax Selank blend"],
  [/pt-141\s*\/\s*oxytocin/i, "PT-141 Oxytocin blend"],
  [/nad\+/i, "NAD NAD+ nicotinamide"],
  [/bac water|bacteriostatic/i, "bacteriostatic water BAC saline"],
];

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ");
}

export function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

// One lowercase haystack per product. Cheap to compute; call it where
// the product list is built (server side) and ship the string down.
export function searchKeywords(name: string, description?: string | null, category?: string | null): string {
  const parts = [name, category || "", stripHtml(description || "")];
  for (const [re, words] of BLEND_ALIASES) {
    if (re.test(name)) parts.push(words);
  }
  return parts.join(" ").toLowerCase();
}

// True when every word of the query appears in the haystack (ignoring
// case and punctuation), so "ghk 50" finds GHK-Cu 50mg and "bpc157" finds
// BPC-157.
export function searchMatches(query: string, keywords: string): boolean {
  const words = query.toLowerCase().split(/\s+/).map(normalize).filter(Boolean);
  if (!words.length) return false;
  const hay = normalize(keywords);
  const loose = keywords.toLowerCase();
  return words.every((w) => hay.includes(w) || loose.includes(w));
}
