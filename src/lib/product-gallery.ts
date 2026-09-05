import "server-only";
import { readdirSync } from "node:fs";
import { join } from "node:path";

// Gallery discovery: files in public/products named by convention
// (<slug>-hero, <slug>-molecule, plus legacy <slug> and optional
// <slug>-vial; .jpg/.png/.webp) appear automatically. The standard set is
// TWO images per product: hero (formula card + vial) and molecule
// (diagram + sequence card). Once a -hero exists it supersedes the legacy
// square <slug> shot, which is then hidden.

// Blend gallery composition: a blend product shows the molecule/sequence
// card of EACH component compound as additional gallery images (matching
// the Blend Profile order on its hero card). Keys are size-stripped slug
// bases; values are the component compounds' slug bases. Components with
// no molecule card yet (e.g. CJC-1295, Tesamorelin) are skipped
// automatically and appear as soon as their card lands in
// public/products.
const BLEND_MOLECULE_COMPONENTS: Record<string, string[]> = {
  "bpc-157-tb-500": ["bpc-157", "tb-500"],
  "cjc-1295-ipamorelin": ["cjc-1295", "ipamorelin"],
  "tesamorelin-ipamorelin": ["tesamorelin", "ipamorelin"],
  klow: ["ghk-cu", "kpv", "bpc-157", "tb-500"],
  glow: ["ghk-cu", "bpc-157", "tb-500"],
};

// public/products is read once per server process; the file set only
// changes with a deploy, which restarts the process anyway.
let fileIndex: Map<string, string> | null = null;
function getFileIndex(): Map<string, string> {
  if (fileIndex) return fileIndex;
  let files: string[] = [];
  try {
    files = readdirSync(join(process.cwd(), "public", "products"));
  } catch {
    // public/products missing in some build contexts; fall through.
  }
  fileIndex = new Map(files.map((f) => [f.toLowerCase(), f]));
  return fileIndex;
}

export function galleryImages(slug: string): string[] {
  const lower = getFileIndex();
  const find = (base: string): string | null => {
    for (const ext of ["jpg", "png", "webp"]) {
      const hit = lower.get(`${base.toLowerCase()}.${ext}`);
      if (hit) return `/products/${hit}`;
    }
    return null;
  };
  const hero = find(`${slug}-hero`);
  const legacy = find(slug);
  // Strip trailing size tokens (5mg, 10ml, 10000iu) to reach the compound
  // base, e.g. bpc-157-5mg -> bpc-157, klow-80mg -> klow. Only size-shaped
  // tokens are stripped, so bpc-157-tb-500-10mg-10mg resolves to
  // bpc-157-tb-500 and can never collapse into a component compound.
  // 2026-09-05 (Josh): blend sizes are now written "5/5mg" (slug
  // bpc-157-tb-500-5-5mg), not "5mg/5mg", so only the LAST token carries a
  // unit. Walk back through trailing size-shaped tokens (a unit token, then
  // any bare numbers behind it) and stop at the first base that is either a
  // known blend or has its own molecule card. Stopping at the first hit is
  // what keeps bpc-157-tb-500-5-5mg from collapsing past "bpc-157-tb-500"
  // into "bpc-157-tb" or "bpc-157".
  const parts = slug.split("-");
  const candidates: string[] = [];
  if (parts.length > 1 && /^\d+(mg|ml|iu|mcg)$/i.test(parts[parts.length - 1])) {
    parts.pop();
    candidates.push(parts.join("-"));
    while (parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) {
      parts.pop();
      candidates.push(parts.join("-"));
    }
  }
  const molecules: string[] = [];
  // Molecule cards: single compounds get their own card, shared by every
  // size (bpc-157-molecule.png serves bpc-157-5mg/10mg/20mg). Blends get
  // one card PER COMPONENT compound, in blend-profile order.
  const ownCard = find(`${slug}-molecule`);
  if (ownCard) {
    molecules.push(ownCard);
  } else {
    for (const base of candidates) {
      const blendComponents = BLEND_MOLECULE_COMPONENTS[base];
      if (blendComponents) {
        for (const component of blendComponents) {
          const card = find(`${component}-molecule`);
          if (card) molecules.push(card);
        }
        break;
      }
      const single = find(`${base}-molecule`);
      if (single) {
        molecules.push(single);
        break;
      }
    }
  }
  const vial = find(`${slug}-vial`);
  return [hero, hero ? null : legacy, ...molecules, vial].filter(
    (x): x is string => Boolean(x)
  );
}
