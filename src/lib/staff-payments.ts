// Payment logging for the staff portal.
//
// A staff member records a payment they saw land (Zelle, Venmo, Apple Cash,
// PayPal, cash/check, bank wire, other). We look up the order by number in
// Swell, compare the gross amount to what the order still owes, and only if
// both line up do we create a captured payment on the order. That flips the
// order to Paid, which fires the existing order.paid webhook and sends the
// customer the "Payment received" email. Every detail from the form is kept
// on the order itself (metadata.payment_log + a line in comments) and on the
// payment record, so nothing lives only in this app.

export const PAYMENT_SOURCES = [
  "Apple Cash",
  "PayPal",
  "Zelle",
  "Venmo",
  "Cash or Check",
  "Bank Wire",
  "Other",
] as const;
export type PaymentSource = (typeof PAYMENT_SOURCES)[number];

export type PaymentInput = {
  dateReceived: string; // YYYY-MM-DD
  source: PaymentSource;
  sourceOther?: string;
  grossAmount: number; // before any fees
  fees: number; // transaction fees, 0 if none
  orderNumber: string;
  recordedBy: string;
  note?: string;
};

export type PaymentResult =
  | { ok: true; orderNumber: string; orderId: string; customer: string; amount: number; net: number; paidAt: string; alreadyPaid?: false }
  | { ok: false; code: "not_found" | "amount_mismatch" | "already_paid" | "canceled" | "invalid"; message: string; expected?: number; orderNumber?: string };

type SwellOrder = {
  id: string;
  number: string;
  grand_total?: number;
  payment_total?: number;
  payment_balance?: number;
  paid?: boolean;
  canceled?: boolean;
  date_created?: string;
  comments?: string | null;
  metadata?: Record<string, unknown> | null;
  billing?: { method?: string; first_name?: string; last_name?: string; name?: string } | null;
  shipping?: { first_name?: string; last_name?: string; name?: string } | null;
  account?: { email?: string; first_name?: string; last_name?: string; name?: string } | null;
  account_id?: string;
};

const money = (n: number) => Math.round(n * 100) / 100;

function auth(): string {
  const id = process.env.SWELL_STORE_ID || process.env.NEXT_PUBLIC_SWELL_STORE_ID;
  const key = process.env.SWELL_SECRET_KEY;
  if (!id || !key) throw new Error("Swell backend credentials missing (SWELL_STORE_ID / SWELL_SECRET_KEY)");
  return "Basic " + Buffer.from(`${id}:${key}`).toString("base64");
}

async function swell<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch("https://api.swell.store" + path, {
    method,
    headers: { Authorization: auth(), "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Swell ${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`);
  const json = text ? JSON.parse(text) : {};
  if (json && typeof json === "object" && json.errors && typeof json.errors === "object") {
    throw new Error(`Swell ${method} ${path} -> ${JSON.stringify(json.errors).slice(0, 300)}`);
  }
  return json as T;
}

export function validatePaymentInput(raw: Record<string, unknown>): { ok: true; value: PaymentInput } | { ok: false; message: string } {
  const str = (k: string) => (typeof raw[k] === "string" ? (raw[k] as string).trim() : "");
  const num = (k: string) => {
    const v = raw[k];
    if (typeof v === "number") return v;
    if (typeof v === "string" && v.trim() !== "") return Number(v.replace(/[$,\s]/g, ""));
    return NaN;
  };
  const dateReceived = str("dateReceived");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateReceived)) return { ok: false, message: "Enter the date the payment was received." };
  const source = str("source") as PaymentSource;
  if (!PAYMENT_SOURCES.includes(source)) return { ok: false, message: "Pick where the payment came from." };
  const sourceOther = str("sourceOther");
  if (source === "Other" && !sourceOther) return { ok: false, message: "Tell us what the other payment source was." };
  const grossAmount = num("grossAmount");
  if (!Number.isFinite(grossAmount) || grossAmount <= 0) return { ok: false, message: "Enter the payment amount received (before fees)." };
  const feesRaw = num("fees");
  const fees = Number.isNaN(feesRaw) ? 0 : feesRaw;
  if (!Number.isFinite(fees) || fees < 0) return { ok: false, message: "Transaction fees must be zero or a positive amount." };
  if (fees >= grossAmount) return { ok: false, message: "Fees can't be as large as the payment itself." };
  const orderNumber = str("orderNumber").replace(/^#/, "");
  if (!/^\d{4,10}$/.test(orderNumber)) return { ok: false, message: "Enter the order number (digits only, like 100021)." };
  const recordedBy = str("recordedBy");
  if (!recordedBy) return { ok: false, message: "Missing staff name." };
  const note = str("note");
  return {
    ok: true,
    value: { dateReceived, source, sourceOther: sourceOther || undefined, grossAmount: money(grossAmount), fees: money(fees), orderNumber, recordedBy, note: note || undefined },
  };
}

function customerName(o: SwellOrder): string {
  const a = o.account;
  const full = (f?: string, l?: string, n?: string) => n || [f, l].filter(Boolean).join(" ");
  return full(a?.first_name, a?.last_name, a?.name) || full(o.billing?.first_name, o.billing?.last_name, o.billing?.name) || full(o.shipping?.first_name, o.shipping?.last_name, o.shipping?.name) || a?.email || "customer";
}

export async function recordPayment(input: PaymentInput): Promise<PaymentResult> {
  const list = await swell<{ results?: SwellOrder[] }>("GET", `/orders?where[number]=${encodeURIComponent(input.orderNumber)}&limit=1&expand=account`);
  const order = list.results?.[0];
  if (!order) {
    return { ok: false, code: "not_found", orderNumber: input.orderNumber, message: `Order #${input.orderNumber} was not found in Swell. Double-check the number on the payment memo or the customer's email.` };
  }
  if (order.canceled) {
    return { ok: false, code: "canceled", orderNumber: order.number, message: `Order #${order.number} is canceled. Nothing was recorded. If the customer paid against it, check whether a replacement order exists (the cancel note usually says).` };
  }
  const grandTotal = money(order.grand_total ?? 0);
  const alreadyPaid = money(order.payment_total ?? 0);
  const owed = money(typeof order.payment_balance === "number" ? -order.payment_balance : grandTotal - alreadyPaid);
  if (order.paid || owed <= 0) {
    return { ok: false, code: "already_paid", orderNumber: order.number, expected: grandTotal, message: `Order #${order.number} is already marked paid ($${grandTotal.toFixed(2)}). Nothing was recorded. If this is a second payment for the same order, it's probably a duplicate and should be refunded.` };
  }
  if (Math.abs(input.grossAmount - owed) > 0.005) {
    const expectedNote = alreadyPaid > 0 ? ` (order total $${grandTotal.toFixed(2)}, $${alreadyPaid.toFixed(2)} already received)` : "";
    return { ok: false, code: "amount_mismatch", orderNumber: order.number, expected: owed, message: `Order #${order.number} was found, but the payment amount doesn't match. You entered $${input.grossAmount.toFixed(2)}; the order is expecting $${owed.toFixed(2)}${expectedNote}. Nothing was recorded.` };
  }

  const sourceLabel = input.source === "Other" ? `Other (${input.sourceOther})` : input.source;
  const net = money(input.grossAmount - input.fees);
  const now = new Date().toISOString();
  const logEntry = {
    date_received: input.dateReceived,
    source: sourceLabel,
    gross_amount: input.grossAmount,
    fees: input.fees,
    net_amount: net,
    recorded_by: input.recordedBy,
    recorded_at: now,
    note: input.note || null,
  };

  // 1) Keep the full form on the order: an append-only log in metadata
  //    plus a one-line human note in comments.
  const existing = Array.isArray(order.metadata?.payment_log) ? (order.metadata!.payment_log as unknown[]) : [];
  const line = `[${input.dateReceived}] Payment received via ${sourceLabel}: $${input.grossAmount.toFixed(2)} gross, $${input.fees.toFixed(2)} fees, $${net.toFixed(2)} net. Recorded by ${input.recordedBy}.${input.note ? ` Note: ${input.note}` : ""}`;
  await swell("PUT", `/orders/${order.id}`, {
    metadata: { ...(order.metadata || {}), payment_log: [...existing, logEntry] },
    comments: [order.comments || "", line].filter(Boolean).join("\n"),
  });

  // 2) The payment record. captured:true is what marks the order paid and
  //    fires the order.paid webhook, which is why the log above is written
  //    first: the internal "payment received" email reads it.
  await swell("POST", "/payments", {
    order_id: order.id,
    account_id: order.account_id,
    amount: input.grossAmount,
    method: order.billing?.method || "other",
    gateway: "manual",
    captured: true,
    success: true,
    date_created: `${input.dateReceived}T12:00:00.000Z`,
    reason_message: `${sourceLabel} received ${input.dateReceived}, gross $${input.grossAmount.toFixed(2)}, fees $${input.fees.toFixed(2)}, net $${net.toFixed(2)}. Logged by ${input.recordedBy} via staff portal.`,
    metadata: { staff_portal: true, ...logEntry },
  });

  return { ok: true, orderNumber: order.number, orderId: order.id, customer: customerName(order), amount: input.grossAmount, net, paidAt: now };
}

export type LoggedPayment = {
  id: string;
  orderNumber: string;
  customer: string;
  dateReceived: string;
  source: string;
  gross: number;
  fees: number;
  net: number;
  recordedBy: string;
  recordedAt: string;
};

// Recent payments logged through the portal, newest first.
export async function recentPayments(limit = 50): Promise<LoggedPayment[]> {
  type P = { id: string; order_id?: string; amount?: number; date_created?: string; metadata?: Record<string, unknown> | null; order?: { number?: string; account?: SwellOrder["account"]; billing?: SwellOrder["billing"]; shipping?: SwellOrder["shipping"] } | null };
  const res = await swell<{ results?: P[] }>("GET", `/payments?where[metadata.staff_portal]=true&sort=date_created%20desc&limit=${limit}&expand=order.account`);
  return (res.results || []).map((p) => {
    const m = (p.metadata || {}) as Record<string, unknown>;
    const o = (p.order || {}) as SwellOrder;
    return {
      id: p.id,
      orderNumber: String(o.number || ""),
      customer: customerName(o),
      dateReceived: String(m.date_received || (p.date_created || "").slice(0, 10)),
      source: String(m.source || ""),
      gross: Number(m.gross_amount ?? p.amount ?? 0),
      fees: Number(m.fees ?? 0),
      net: Number(m.net_amount ?? p.amount ?? 0),
      recordedBy: String(m.recorded_by || ""),
      recordedAt: String(m.recorded_at || p.date_created || ""),
    };
  });
}
