// Internal "what just happened" emails for the team.
//
// Josh (2026-09-07): "whenever we receive a new order, I wanna make sure
// that we are notified to our customer service email... and then same
// whenever an order has been marked paid... basically all of the
// progressions. I wanna get a really detailed email from an administrative
// side because a lot of these people are not gonna log in and look at the
// system."
//
// Every webhook route calls notifyAdmins() after the customer email. It
// never throws (a failure here must not break the customer notification),
// and it is skipped entirely when ORDER_ADMIN_NOTIFICATION_EMAIL is set to
// "off". Recipients: ORDER_ADMIN_NOTIFICATION_EMAIL, comma separated (first
// address is To, the rest CC). Defaults to customerservice@.
//
// Optional RESEND_ADMIN_FROM_EMAIL lets the internal mail use a different
// From than customer mail (useful if the company's inbound spam filter
// treats "from our own domain" mail as spoofing).

import { sendEmail } from "@/lib/resend";
import {
  BRAND,
  badgeHtml,
  formatCurrency,
  itemsListHtml,
  summaryCardHtml,
  wrapEmailHtml,
  type SwellOrder,
} from "@/lib/swell-backend-notify";

export type AdminEvent =
  | "order_created"
  | "order_paid"
  | "order_shipped"
  | "order_delivered"
  | "shipment_updated"
  | "order_canceled"
  | "order_refunded"
  | "draft_invoice_sent";

const SWELL_ADMIN = "https://vitality-certified-peptides.swell.store/admin";

function recipients(): { to: string; cc: string[] } | null {
  const raw = (process.env.ORDER_ADMIN_NOTIFICATION_EMAIL || "customerservice@vitalitycertifiedpeptides.com").trim();
  if (!raw || raw.toLowerCase() === "off") return null;
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
  if (list.length === 0) return null;
  return { to: list[0], cc: list.slice(1) };
}

function esc(s: unknown): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function customerName(o: SwellOrder): string {
  const a = o.account;
  const full = (f?: string, l?: string, n?: string) => n || [f, l].filter(Boolean).join(" ");
  return full(a?.first_name, a?.last_name, a?.name) || full(o.billing?.first_name, o.billing?.last_name, o.billing?.name) || full(o.shipping?.first_name, o.shipping?.last_name, o.shipping?.name) || "Customer";
}

function programFor(o: SwellOrder): string {
  const g = (o.account?.group || "").toLowerCase();
  if (g === "friends-family") return "Inner Circle";
  if (g === "wholesale") return "Wholesale";
  return "Retail";
}

function addressLines(o: SwellOrder): string[] {
  const s = o.shipping;
  if (!s) return [];
  const name = s.name || [s.first_name, s.last_name].filter(Boolean).join(" ");
  return [name, s.address1, s.address2, [s.city, s.state, s.zip].filter(Boolean).join(", "), s.phone ? `Phone ${s.phone}` : ""].filter((x): x is string => Boolean(x && x.trim()));
}

function kv(rows: Array<[string, string | undefined]>): string {
  const body = rows.filter(([, v]) => v && v.trim()).map(([k, v]) => `<tr><td style="padding:6px 8px 6px 0; font-size:13px; color:${BRAND.muted}; white-space:nowrap; vertical-align:top;">${esc(k)}</td><td style="padding:6px 0; font-size:14px; color:${BRAND.ink}; vertical-align:top;">${v}</td></tr>`).join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:8px 0 16px;">${body}</table>`;
}

function totalsHtml(o: SwellOrder): string {
  const cur = o.currency || "USD";
  const rows: Array<[string, string]> = [["Subtotal", formatCurrency(o.sub_total, cur)]];
  if ((o.discount_total ?? 0) > 0) rows.push(["Discount", `-${formatCurrency(o.discount_total, cur)}`]);
  const ship = o.shipment_total ?? o.shipment_price ?? 0;
  rows.push([`Shipping${o.shipping_service_name ? ` (${esc(o.shipping_service_name)})` : ""}`, ship > 0 ? formatCurrency(ship, cur) : "Free"]);
  if ((o.refund_total ?? 0) > 0) rows.push(["Refunded", `-${formatCurrency(o.refund_total, cur)}`]);
  rows.push(["Total", `<strong>${formatCurrency(o.grand_total, cur)}</strong>`]);
  if ((o.payment_total ?? 0) > 0) rows.push(["Paid so far", formatCurrency(o.payment_total, cur)]);
  return kv(rows);
}

function paymentHtml(o: SwellOrder): string {
  const log = o.metadata?.payment_log;
  const last = Array.isArray(log) && log.length ? log[log.length - 1] : null;
  if (!last) return `<p style="font-size:14px; color:${BRAND.muted};">No staff-portal payment entry on this order (it was marked paid from Swell directly, or the entry is missing).</p>`;
  const cur = o.currency || "USD";
  return kv([
    ["Received on", esc(last.date_received)],
    ["Received through", esc(last.source)],
    ["Amount (before fees)", formatCurrency(last.gross_amount, cur)],
    ["Fees", formatCurrency(last.fees ?? 0, cur)],
    ["Net", formatCurrency(last.net_amount, cur)],
    ["Recorded by", esc(last.recorded_by)],
    ["Note", last.note ? esc(last.note) : undefined],
  ]);
}

function shipmentHtml(o: SwellOrder): string {
  const s = o.shipments?.[o.shipments.length - 1];
  if (!s) return "";
  return kv([
    ["Carrier", esc(s.carrier)],
    ["Service", esc(s.service)],
    ["Tracking", s.tracking_code ? (s.tracking_url ? `<a href="${esc(s.tracking_url)}" style="color:${BRAND.gold};">${esc(s.tracking_code)}</a>` : esc(s.tracking_code)) : undefined],
    ["Delivered", s.delivered ? "Yes" : "Not yet"],
  ]);
}

const EVENT: Record<AdminEvent, { badge: string; color: string; title: (n: string) => string; lead: string }> = {
  order_created: { badge: "NEW ORDER", color: BRAND.gold, title: (n) => `New order #${n}`, lead: "A new order was placed. The customer has the payment instructions; nothing is paid yet." },
  order_paid: { badge: "PAYMENT RECEIVED", color: BRAND.green, title: (n) => `Order #${n} marked paid`, lead: "This order is now Paid and has been sent to ShipStation. Ship it, then note the lot and send the COA." },
  order_shipped: { badge: "SHIPPED", color: BRAND.green, title: (n) => `Order #${n} shipped`, lead: "A label was created and the customer has been sent tracking. Remember the COA email." },
  order_delivered: { badge: "DELIVERED", color: BRAND.green, title: (n) => `Order #${n} delivered`, lead: "The carrier marked this delivered and the customer was notified." },
  shipment_updated: { badge: "SHIPMENT UPDATE", color: BRAND.gold, title: (n) => `Shipment update on order #${n}`, lead: "The carrier posted an update on this shipment." },
  order_canceled: { badge: "CANCELED", color: "#B42318", title: (n) => `Order #${n} canceled`, lead: "This order was canceled and the customer was told no payment is required. Check whether stock needs to go back." },
  order_refunded: { badge: "REFUNDED", color: "#B42318", title: (n) => `Refund recorded on order #${n}`, lead: "A refund was recorded in Swell. Make sure the money actually went back through the customer's payment app." },
  draft_invoice_sent: { badge: "INVOICE SENT", color: BRAND.gold, title: (n) => `Draft order invoice sent for #${n}`, lead: "A draft order invoice was emailed to the customer." },
};

export async function notifyAdmins(event: AdminEvent, order: SwellOrder, opts: { customerEmailed?: boolean; customerEmail?: string } = {}): Promise<void> {
  try {
    const r = recipients();
    if (!r) return;
    const e = EVENT[event];
    const number = order.number ? String(order.number) : order.id;
    const name = customerName(order);
    const program = programFor(order);
    const cur = order.currency || "USD";
    const total = formatCurrency(order.grand_total, cur);
    const email = opts.customerEmail || order.account?.email || order.email || order.billing?.email || order.shipping?.email;
    const phone = order.account?.phone || order.shipping?.phone;
    const placed = order.date_created ? new Date(order.date_created).toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" }) + " PT" : undefined;
    const orderUrl = `${SWELL_ADMIN}/orders/${order.id}`;

    const subject = `[VCP] ${e.title(number)} · ${name} · ${total} · ${program}`;

    const html = wrapEmailHtml(`${badgeHtml(e.badge, e.color)}
<p style="font-size:15px;">${esc(e.lead)}</p>
${summaryCardHtml([
  { label: "Order", value: `#${esc(number)}` },
  { label: "Total", value: total, emphasize: true },
  { label: "Program", value: esc(program) },
])}
<h3 style="margin:18px 0 4px; font-size:13px; letter-spacing:0.5px; text-transform:uppercase; color:${BRAND.muted};">Customer</h3>
${kv([
  ["Name", esc(name)],
  ["Email", email ? `<a href="mailto:${esc(email)}" style="color:${BRAND.gold};">${esc(email)}</a>` : "none on file"],
  ["Phone", phone ? esc(phone) : undefined],
  ["Group", esc(order.account?.group || "none (retail)")],
  ["Placed", placed],
  ["Payment method", esc(order.billing?.method === "invoice" ? "Pay by invoice (Zelle / Venmo / Apple Cash / PayPal)" : order.billing?.method || "")],
  ["Customer emailed", opts.customerEmailed === undefined ? undefined : opts.customerEmailed ? "Yes" : "NO - no email on file, follow up by hand"],
])}
<h3 style="margin:18px 0 4px; font-size:13px; letter-spacing:0.5px; text-transform:uppercase; color:${BRAND.muted};">Items</h3>
${itemsListHtml(order.items, cur)}
${totalsHtml(order)}
${event === "order_paid" ? `<h3 style="margin:18px 0 4px; font-size:13px; letter-spacing:0.5px; text-transform:uppercase; color:${BRAND.muted};">Payment</h3>${paymentHtml(order)}` : ""}
${event === "order_shipped" || event === "order_delivered" || event === "shipment_updated" ? `<h3 style="margin:18px 0 4px; font-size:13px; letter-spacing:0.5px; text-transform:uppercase; color:${BRAND.muted};">Shipment</h3>${shipmentHtml(order)}` : ""}
<h3 style="margin:18px 0 4px; font-size:13px; letter-spacing:0.5px; text-transform:uppercase; color:${BRAND.muted};">Ship to</h3>
${addressLines(order).length ? `<p style="font-size:14px; line-height:1.5; margin:4px 0 16px;">${addressLines(order).map(esc).join("<br>")}</p>` : `<p style="font-size:14px; color:#B42318; margin:4px 0 16px;"><strong>No shipping address on the order.</strong> Wholesale orders need one added in Swell (Shipping > Edit) before shipping.</p>`}
${order.comments ? `<h3 style="margin:18px 0 4px; font-size:13px; letter-spacing:0.5px; text-transform:uppercase; color:${BRAND.muted};">Order comments</h3><p style="font-size:13px; color:${BRAND.muted}; white-space:pre-wrap; margin:4px 0 16px;">${esc(order.comments)}</p>` : ""}
<p style="font-size:14px; margin-top:20px;"><a href="${orderUrl}" style="color:${BRAND.gold}; font-weight:bold;">Open order #${esc(number)} in Swell</a>${event === "order_created" ? ` &nbsp;·&nbsp; <a href="https://www.vitalitycertifiedpeptides.com/staff/payments" style="color:${BRAND.gold}; font-weight:bold;">Log the payment when it arrives</a>` : ""}</p>
<p style="font-size:12px; color:${BRAND.muted};">Internal notification. The customer received their own email for this step${opts.customerEmailed === false ? " (NOT sent: no email on file)" : ""}.</p>`);

    const textLines = [
      e.title(number), e.lead, "",
      `Customer: ${name}${email ? ` <${email}>` : " (no email)"}${phone ? `, ${phone}` : ""}`,
      `Program: ${program}   Total: ${total}`,
      "", "Items:",
      ...(order.items || []).map((i) => `  ${i.product_name ?? "Item"} x${i.quantity ?? 1} @ ${formatCurrency(i.price, cur)}`),
      "",
      `Ship to: ${addressLines(order).join(", ") || "NO ADDRESS ON ORDER"}`,
      order.comments ? `Comments: ${order.comments}` : "",
      "", `Open in Swell: ${orderUrl}`,
    ];

    await sendEmail({ to: r.to, cc: r.cc, subject, html, text: textLines.filter((l) => l !== undefined).join("\n"), from: process.env.RESEND_ADMIN_FROM_EMAIL || undefined });
  } catch (err) {
    console.error(`admin notification (${event}) failed`, err);
  }
}
