"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/theme/settings";
import { findPreset } from "@/lib/theme/presets";
import { siteSettingsSchema } from "@/lib/validation/settings";

export async function applyPreset(presetId: string) {
  await requireAdmin();
  const preset = findPreset(presetId);
  if (!preset) {
    throw new Error("Unknown preset");
  }

  const current = await getSiteSettings();
  await db
    .update(siteSettings)
    .set({
      themePreset: preset.id,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, current.id));

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function updateSettings(formData: FormData) {
  await requireAdmin();

  const parsed = siteSettingsSchema.safeParse({
    siteTitle: formData.get("siteTitle"),
    siteDescription: formData.get("siteDescription"),
    primaryColor: formData.get("primaryColor"),
    secondaryColor: formData.get("secondaryColor"),
    accentColor: formData.get("accentColor"),
    backgroundColor: formData.get("backgroundColor"),
    textColor: formData.get("textColor"),
  });
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const data = parsed.data;
  const current = await getSiteSettings();

  await db
    .update(siteSettings)
    .set({
      siteTitle: data.siteTitle,
      siteDescription: data.siteDescription || null,
      themePreset: null,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      accentColor: data.accentColor,
      backgroundColor: data.backgroundColor,
      textColor: data.textColor,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, current.id));

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
