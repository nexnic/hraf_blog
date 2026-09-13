import "server-only";
import { Resend } from "resend";

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendVerificationEmail(email: string, token: string) {
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not set");
  }
  if (!process.env.SITE_URL) {
    throw new Error("SITE_URL is not set");
  }

  const verifyUrl = `${process.env.SITE_URL}/verify?token=${encodeURIComponent(token)}`;

  const resend = getResendClient();
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Bekreft abonnementet ditt",
    html: `<p>Takk for at du meldte deg på! Klikk lenken under for å bekrefte e-postadressen din:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>Lenken er gyldig i 24 timer.</p>`,
    text: `Bekreft e-postadressen din: ${verifyUrl} (gyldig i 24 timer)`,
  });
}
