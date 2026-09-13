import { z } from "zod";
import { postStatusValues } from "@/db/schema";

export const postSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  content: z.string().max(50_000).optional().or(z.literal("")),
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.enum(postStatusValues),
  coverImageKey: z.string().max(300).optional().or(z.literal("")),
});
