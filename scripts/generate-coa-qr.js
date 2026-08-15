#!/usr/bin/env node
// Generates a QR code PNG pointing at a product+lot's COA page, for print
// on vial labels / packing slips. Usage:
//
//   npm run generate-qr -- <product-slug> <lot-number>
//
// Example:
//   npm run generate-qr -- bpc-157 LOT045
//
// Writes the PNG to qr-codes/<product-slug>--<lot-number>.png (gitignored,
// these are print assets, not part of the deployed site).

const QRCode = require("qrcode");
const fs = require("node:fs");
const path = require("node:path");

const [, , productSlug, lot] = process.argv;

if (!productSlug || !lot) {
  console.error("Usage: npm run generate-qr -- <product-slug> <lot-number>");
  process.exit(1);
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vitalitycertifiedpeptides.com";
const url = `${siteUrl}/coa/${productSlug}/${lot}`;

const outDir = path.join(process.cwd(), "qr-codes");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `${productSlug}--${lot}.png`);

QRCode.toFile(outFile, url, { width: 600, margin: 2 }, (err) => {
  if (err) {
    console.error("Failed to generate QR code:", err);
    process.exit(1);
  }
  console.log(`QR code for ${url}`);
  console.log(`Saved to ${outFile}`);
  console.log("");
  console.log("Reminder: also drop the matching COA PDF in public/coas/ as");
  console.log(`  ${productSlug}--${lot}.pdf`);
  console.log("before this QR code will resolve to anything on the live site.");
});
