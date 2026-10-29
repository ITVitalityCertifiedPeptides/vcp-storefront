// Minimal Resend client used for server-triggered transactional email (the
// automated "payment received" notification, and any future automated
// emails). Plain fetch against Resend's REST API rather than the `resend`
// npm package, so no new dependency needs installing/committing to use it.
//
// Requires in Vercel (Project Settings > Environment Variables):
//   RESEND_API_KEY     - from resend.com/api-keys
//   RESEND_FROM_EMAIL   - optional, defaults to customerservice@vitalitycertifiedpeptides.com
//                          (must be on the verified sending domain in Resend)
//
// Never expose RESEND_API_KEY as NEXT_PUBLIC_* - it must stay server-only.

import "server-only";

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
  // Resend attachment: content is base64.
  attachments?: Array<{ filename: string; content: string }>;
};

export async function sendEmail({ to, subject, html, text, replyTo, cc, bcc, from: fromOverride, attachments }: SendEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  const from =
    fromOverride || process.env.RESEND_FROM_EMAIL || "Customer Service <customerservice@vitalitycertifiedpeptides.com>";

  // info@ is blind-copied on every email that goes to a customer (2026-10-29).
  // Internal mail to our own domain is left alone so the team doesn't get two.
  const INFO_COPY = "info@vitalitycertifiedpeptides.com";
  const isInternal = to.toLowerCase().endsWith("@vitalitycertifiedpeptides.com");
  const bccList = [...(Array.isArray(bcc) ? bcc : bcc ? [bcc] : []), ...(isInternal ? [] : [INFO_COPY])];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      ...(cc && (Array.isArray(cc) ? cc.length > 0 : cc) ? { cc } : {}),
      ...(bccList.length ? { bcc: bccList } : {}),
      subject,
      html,
      text,
      reply_to: replyTo || "customerservice@vitalitycertifiedpeptides.com",
      ...(attachments && attachments.length ? { attachments } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend send failed: ${response.status} ${body}`);
  }

  return (await response.json()) as { id: string };
}
