import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { LOGO_EMBLEM_URL, type SwellOrder } from "./swell-backend-notify";

// Packing slip PDF, attached to the internal "payment received" email so
// whoever ships can print it and drop it in the box. Customer-facing: no
// prices, no payment details, no internal comments.

const INK = rgb(0.08, 0.075, 0.06);
const MUTED = rgb(0.42, 0.4, 0.36);
const GOLD = rgb(0.65, 0.49, 0.14);
const LINE = rgb(0.8, 0.73, 0.55);
const PAGE_W = 612;
const PAGE_H = 792;
const M = 48;

function customerName(order: SwellOrder): string {
  const a = order.account;
  const s = order.shipping;
  const b = order.billing;
  const full = (f?: string, l?: string) => [f, l].filter(Boolean).join(" ").trim();
  return full(s?.first_name, s?.last_name) || s?.name || full(a?.first_name, a?.last_name) || a?.name || full(b?.first_name, b?.last_name) || "Customer";
}

function shipToLines(order: SwellOrder): string[] {
  const s = order.shipping || {};
  const cityLine = [s.city, [s.state, s.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  return [customerName(order), s.address1, s.address2, cityLine, s.country && s.country !== "US" ? s.country : undefined].filter((x): x is string => Boolean(x && x.trim()));
}

export async function buildPackingSlipPdf(order: SwellOrder): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  pdf.setTitle(`Packing slip - order #${order.number ?? order.id}`);
  pdf.setAuthor("Vitality Certified Peptides");

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - M;

  const text = (s: string, x: number, yy: number, font: PDFFont, size: number, color = INK) => page.drawText(s, { x, y: yy, size, font, color });
  const right = (s: string, xRight: number, yy: number, font: PDFFont, size: number, color = INK) => page.drawText(s, { x: xRight - font.widthOfTextAtSize(s, size), y: yy, size, font, color });
  const rule = (yy: number, color = LINE, w = 0.8) => page.drawLine({ start: { x: M, y: yy }, end: { x: PAGE_W - M, y: yy }, thickness: w, color });

  // Header: emblem (best effort), wordmark, title block on the right.
  let logoW = 0;
  try {
    const res = await fetch(LOGO_EMBLEM_URL);
    if (res.ok) {
      const png = await pdf.embedPng(await res.arrayBuffer());
      const h = 40;
      const w = (png.width / png.height) * h;
      page.drawImage(png, { x: M, y: y - h + 6, width: w, height: h });
      logoW = w + 10;
    }
  } catch {
    // no logo, fine
  }
  text("Vitality Certified Peptides", M + logoW, y - 12, serifBold, 18);
  text("www.vitalitycertifiedpeptides.com  ·  customerservice@vitalitycertifiedpeptides.com", M + logoW, y - 28, sans, 8.5, MUTED);

  right("PACKING SLIP", PAGE_W - M, y - 10, sansBold, 12, GOLD);
  const number = order.number ? String(order.number) : order.id;
  right(`Order #${number}`, PAGE_W - M, y - 28, serifBold, 15);
  const placed = order.date_created ? new Date(order.date_created).toLocaleDateString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium" }) : "";
  if (placed) right(`Placed ${placed}`, PAGE_W - M, y - 42, sans, 9, MUTED);

  y -= 62;
  rule(y, GOLD, 1.2);
  y -= 22;

  // Ship to / customer columns
  const col2 = M + 270;
  text("SHIP TO", M, y, sansBold, 8.5, GOLD);
  text("CUSTOMER", col2, y, sansBold, 8.5, GOLD);
  y -= 15;
  const ship = shipToLines(order);
  const email = order.account?.email || order.email || order.billing?.email || order.shipping?.email;
  const phone = order.account?.phone || order.shipping?.phone;
  const cust = [customerName(order), email, phone, order.account?.group === "wholesale" ? "Wholesale account" : order.account?.group === "friends-family" ? "Inner Circle member" : undefined].filter((x): x is string => Boolean(x));
  const rows = Math.max(ship.length, cust.length, 1);
  for (let i = 0; i < rows; i++) {
    if (ship[i]) text(ship[i], M, y, i === 0 ? serifBold : serif, 11);
    if (cust[i]) text(cust[i], col2, y, i === 0 ? serifBold : serif, 11);
    y -= 15;
  }
  if (!ship.length) text("No shipping address on the order - check Swell before shipping.", M, y + 15, sansBold, 10, rgb(0.7, 0.13, 0.09));
  if (order.shipping_service_name || order.shipping?.service_name) {
    y -= 4;
    text(`Shipping: ${order.shipping_service_name || order.shipping?.service_name}`, M, y, sans, 9.5, MUTED);
    y -= 15;
  }

  y -= 10;

  // Items table
  const cQty = M;
  const cItem = M + 48;
  const cSku = M + 400;
  const header = () => {
    text("QTY", cQty, y, sansBold, 8.5, GOLD);
    text("ITEM", cItem, y, sansBold, 8.5, GOLD);
    text("SKU", cSku, y, sansBold, 8.5, GOLD);
    y -= 6;
    rule(y);
    y -= 16;
  };
  header();
  const items = order.items || [];
  let units = 0;
  for (const it of items) {
    if (y < M + 120) {
      page = pdf.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - M;
      header();
    }
    const qty = Number(it.quantity ?? 1);
    units += qty;
    text(String(qty), cQty + 6, y, serifBold, 12);
    text(it.product_name || "Item", cItem, y, serif, 11.5);
    if (it.sku) text(it.sku, cSku, y, sans, 8.5, MUTED);
    y -= 8;
    rule(y, rgb(0.92, 0.89, 0.82), 0.5);
    y -= 16;
  }
  y -= 2;
  right(`${items.length} line${items.length === 1 ? "" : "s"}  ·  ${units} unit${units === 1 ? "" : "s"}`, PAGE_W - M, y, sans, 9, MUTED);
  y -= 24;
  text("Thank you for your order.", M, y, serif, 11.5);

  // Footer
  const fy = M + 26;
  rule(fy + 18, LINE, 0.8);
  text("All products are for laboratory research use only. Not for human or veterinary use.", M, fy, sansBold, 8.5, INK);
  text("Questions about this order: customerservice@vitalitycertifiedpeptides.com", M, fy - 12, sans, 8.5, MUTED);

  return pdf.save();
}

export function packingSlipFilename(order: SwellOrder): string {
  return `VCP-packing-slip-${order.number ?? order.id}.pdf`;
}
