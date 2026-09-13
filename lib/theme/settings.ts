import "server-only";
import { cache } from "react";
import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";

export const getSiteSettings = cache(async () => {
  const [existing] = await db.select().from(siteSettings).limit(1);
  if (existing) {
    return existing;
  }

  const [created] = await db.insert(siteSettings).values({}).returning();
  return created;
});
