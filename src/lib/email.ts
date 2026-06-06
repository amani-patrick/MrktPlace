interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/** Resend API — graceful no-op when RESEND_API_KEY is unset */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "Amnii <onboarding@resend.dev>";

  if (!apiKey) {
    console.info("[email] skipped (no RESEND_API_KEY):", subject, "→", to);
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    console.error("[email] failed:", await res.text());
    return false;
  }

  return true;
}
