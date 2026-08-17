# Expanded Product Description Template (Compliance-Safe)

Goal: give a researcher everything they'd expect from a reagent/research-compound
listing (like a Sigma-Aldrich or Cayman Chemical product page) without ever
crossing into a human-use, benefit, or dosing claim. The GTM doc's rule is
absolute: describe what has been **studied**, never what the compound **does
for the reader**. Third-person, literature-referenced, no "you," no "helps,"
no administration instructions.

## Sections to add per product

1. **Overview** (1–2 sentences, this already exists) — what the compound is,
   its class, what it's studied for. Keep as-is.

2. **Mechanism of action** — receptor/target, pathway, how it's believed to
   act at a molecular level. Framed as "acts as..." / "binds..." / "has been
   characterized as...", never "this will make you...".
   *Example: "Tirzepatide is a synthetic dual agonist at the GIP and GLP-1
   receptors, activating both G-protein-coupled receptor pathways involved
   in insulin secretion and glucose homeostasis in preclinical models."*

3. **Structure & identity**
   - Molecular formula
   - Molecular weight
   - Sequence (for peptides) or IUPAC/structure reference (for small molecules)
   - Synonyms / alternate names researchers may search by
   - CAS number (already have this field)

4. **Research findings summary** — 2–4 sentences summarizing what's been
   reported in published preclinical/clinical literature, always attributed
   to "research" or "studies," never presented as an expected outcome for
   the buyer.
   *Acceptable: "In published preclinical studies, BPC-157 has been reported
   to influence angiogenesis and tissue repair signaling pathways."*
   *Not acceptable: "BPC-157 helps heal injuries" or "supports recovery."*

5. **Physicochemical / purity spec** — purity threshold (e.g. "≥98% by
   HPLC"), appearance (lyophilized powder, etc.), solubility notes for
   reconstitution *as a laboratory material* (not a dosing instruction —
   e.g. "soluble in bacteriostatic water or sterile water for research
   preparation" is fine; "reconstitute to X mg/mL and inject Y units" is not).
   - This is exactly the kind of info a real COA also carries, so it
     reinforces the COA program rather than duplicating it.

6. **Storage** — handling/storage conditions for the material (e.g.
   "Store lyophilized powder at -20°C; reconstituted solution should be
   used within [X] and stored refrigerated"). This is standard reagent
   handling guidance, not a use instruction, so it's safe.

7. **Intended use line** (already exists via the RUO disclaimer field, keep
   as the closing line on every product).

## Language guardrails (apply to every section)

- Third person only. No "you," "your," "we recommend."
- "Studied for," "reported to," "investigated in the context of" — never
  "used to," "helps," "treats," "boosts," "improves."
- No dosing amounts, frequencies, or administration routes directed at a
  human/animal user. Purity/reconstitution-for-research-prep language is
  fine; injection/administration guidance is not.
- No citations to consumer health sites, forums, or bodybuilding sources —
  cite peer-reviewed literature or none at all (a vague "published research
  has reported..." without a specific citation is safer than a citation to
  a low-quality source).
- If in doubt on a specific sentence, ask: "could this sentence be read as
  telling a person what will happen if they take this?" If yes, cut it.

## Worked example — Tirzepatide

**Overview** (existing): A synthetic dual GIP/GLP-1 receptor agonist peptide
studied in research settings for effects on glucose regulation and body
weight.

**Mechanism of action:** Tirzepatide is a 39-amino-acid synthetic peptide
that acts as a dual agonist at the glucose-dependent insulinotropic
polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptors, two
G-protein-coupled receptors implicated in incretin signaling and glucose
homeostasis.

**Structure & identity:**
- Molecular formula: C225H348N48O68
- Molecular weight: ~4813.5 g/mol
- CAS: 2023788-19-2
- Synonyms: LY3298176

**Research findings summary:** Published preclinical and clinical research
has studied tirzepatide's effects on glycemic parameters and body weight in
model systems and clinical trial populations, with mechanistic work focused
on its dual-incretin receptor activity relative to single-agonist
comparators.

**Physicochemical/purity spec:** Supplied as a lyophilized powder,
≥98% purity by HPLC (verify against the lot-specific Certificate of
Analysis). Soluble in bacteriostatic water for laboratory preparation.

**Storage:** Store lyophilized powder at -20°C, protected from light.
Reconstituted solution should be stored refrigerated and used promptly for
research use.

**Intended use** (existing RUO field): For laboratory research use only.
Not for human consumption.

---

## Applying this across the catalog

This needs two things once you sign off on the format:
1. Researched content per compound (mechanism, formula/MW/sequence, purity
   spec, storage) — I can draft all of these from public chemical/research
   databases the same way the CAS numbers were sourced, flagged for
   verification like the CAS numbers were.
2. A way to push it live — either as new Swell content fields (like
   `category`/`cas_number`/`ruo_disclaimer` were added) via the import
   script on your Mac, or directly via the Swell API if you want to share
   read/write API credentials into this session.
