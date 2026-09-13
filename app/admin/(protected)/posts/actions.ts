"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { slugify } from "@/lib/slug";
import { postSchema } from "@/lib/validation/post";

function parsePostForm(formData: FormData) {
  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    categoryId: formData.get("categoryId") || undefined,
    status: formData.get("status"),
    coverImageKey: formData.get("coverImageKey"),
  });
  if (!parsed.success) {
    throw new Error("Invalid input");
  }
  return parsed.data;
}

export async function createPost(formData: FormData) {
  const session = await requireAdmin();
  const data = parsePostForm(formData);

  const [created] = await db
    .insert(posts)
    .values({
      title: data.title,
      slug: slugify(data.title),
      excerpt: data.excerpt || null,
      content: data.content || "",
      categoryId: data.categoryId ?? null,
      status: data.status,
      coverImageKey: data.coverImageKey || null,
      publishedAt: data.status === "published" ? new Date() : null,
      authorId: session.adminId,
    })
    .returning({ id: posts.id });

  revalidatePath("/admin");
  redirect(`/admin/posts/${created.id}/edit`);
}

export async function updatePost(postId: number, formData: FormData) {
  await requireAdmin();
  const data = parsePostForm(formData);

  const [existing] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  if (!existing) {
    throw new Error("Post not found");
  }

  await db
    .update(posts)
    .set({
      title: data.title,
      excerpt: data.excerpt || null,
      content: data.content || "",
      categoryId: data.categoryId ?? null,
      status: data.status,
      coverImageKey: data.coverImageKey || null,
      publishedAt:
        data.status === "published" && !existing.publishedAt
          ? new Date()
          : existing.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, postId));

  revalidatePath("/admin");
  revalidatePath(`/admin/posts/${postId}/edit`);
}

export async function deletePost(postId: number) {
  await requireAdmin();
  await db.delete(posts).where(eq(posts.id, postId));
  revalidatePath("/admin");
}
