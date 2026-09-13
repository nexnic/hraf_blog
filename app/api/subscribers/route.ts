import { randomBytes } from "crypto";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { subscribers } from "@/db/schema";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendVerificationEmail } from "@/lib/email/resend";
import { subscribeSchema } from "@/lib/validation/subscriber";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, turnstileToken } = parsed.data;
  const ip = request.headers.get("x-forwarded-for") ?? undefined;

  const verified = await verifyTurnstileToken(turnstileToken, ip);
  if (!verified) {
    return NextResponse.json({ error: "Bot-sjekk feilet" }, { status: 400 });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await db
    .insert(subscribers)
    .values({
      email,
      status: "pending",
      verificationToken: token,
      verificationTokenExpiresAt: expiresAt,
    })
    .onConflictDoUpdate({
      target: subscribers.email,
      set: {
        status: "pending",
        verificationToken: token,
        verificationTokenExpiresAt: expiresAt,
      },
      // Don't reset an already-verified subscriber back to pending on a repeat signup.
      setWhere: sql`${subscribers.status} != 'verified'`,
    });

  await sendVerificationEmail(email, token);

  return NextResponse.json({ data: { message: "Sjekk e-posten din for bekreftelseslenke." } });
}
