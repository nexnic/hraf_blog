import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Må være en hex-farge, f.eks. #171717");

export const siteSettingsSchema = z.object({
  siteTitle: z.string().min(1).max(200),
  siteDescription: z.string().max(500).optional().or(z.literal("")),
  primaryColor: hexColor,
  secondaryColor: hexColor,
  accentColor: hexColor,
  backgroundColor: hexColor,
  textColor: hexColor,
});
