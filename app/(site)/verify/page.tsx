import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db/client";
import { subscribers } from "@/db/schema";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <p>Mangler bekreftelseslenke.</p>;
  }

  const [subscriber] = await db
    .select()
    .from(subscribers)
    .where(
      and(
        eq(subscribers.verificationToken, token),
        gt(subscribers.verificationTokenExpiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!subscriber) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Lenken er ugyldig eller utløpt</h1>
        <p className="opacity-70">Meld deg på igjen for å få en ny bekreftelseslenke.</p>
      </div>
    );
  }

  await db
    .update(subscribers)
    .set({
      status: "verified",
      verifiedAt: new Date(),
      verificationToken: null,
      verificationTokenExpiresAt: null,
    })
    .where(eq(subscribers.id, subscriber.id));

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">E-post bekreftet</h1>
      <p className="opacity-70">Takk! Abonnementet ditt er nå aktivt.</p>
    </div>
  );
}
