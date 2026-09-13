"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { categories } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";
import { categorySchema } from "@/lib/validation/category";

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const { name, description } = parsed.data;
  await db.insert(categories).values({
    name,
    slug: slugify(name),
    description: description || null,
  });

  revalidatePath("/admin/categories");
}

export async function deleteCategory(categoryId: number) {
  await requireAdmin();
  await db.delete(categories).where(eq(categories.id, categoryId));
  revalidatePath("/admin/categories");
}
