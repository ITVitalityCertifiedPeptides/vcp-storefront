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
};

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  const from =
    process.env.RESEND_FROM_EMAIL || "Vitality Certified Peptides <customerservice@vitalitycertifiedpeptides.com>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text,
      reply_to: replyTo || "customerservice@vitalitycertifiedpeptides.com",
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend send failed: ${response.status} ${body}`);
  }

  return (await response.json()) as { id: string };
}
