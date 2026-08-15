# COA repository

Drop Certificate of Analysis PDFs in this folder to make them reachable by
QR code. Not listed anywhere on the site, not in the sitemap, only found by
whoever scans the QR code on an order or vial label.

## Naming convention

    {product-slug}--{lot-number}.pdf

- `product-slug` is the same slug used in the product's URL on the site
  (e.g. the BPC-157 product page is `/products/bpc-157`, so its slug is
  `bpc-157`). Lowercase, hyphens only.
- `lot-number` is whatever lot/batch identifier your supplier's COA uses.
  Keep it filesystem-safe: letters, numbers, and hyphens only, no spaces or
  slashes.

Example: `bpc-157--LOT045.pdf`

That file becomes reachable at:

    https://vitalitycertifiedpeptides.com/coa/bpc-157/LOT045

## Adding a new one

1. Drop the PDF in this folder using the naming convention above.
2. Run `npm run generate-qr -- bpc-157 LOT045` from the project root to get
   a QR PNG for that product+lot (see `scripts/generate-coa-qr.js`).
3. Commit and push like any other change:
   `git add -A && git commit -m "Add COA for bpc-157 lot LOT045" && git push`
4. Put the generated QR PNG on the vial label / packing slip artwork for
   that lot.

The page at `/coa/{product}/{lot}` checks for this exact file at request
time, so nothing else needs to change in the code for a new lot, just add
the PDF and push.
