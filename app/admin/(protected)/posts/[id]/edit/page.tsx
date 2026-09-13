import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { categories, posts } from "@/db/schema";
import PostForm from "@/components/admin/PostForm";
import { updatePost } from "../../actions";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) {
    notFound();
  }

  const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  if (!post) {
    notFound();
  }

  const allCategories = await db.select().from(categories).orderBy(categories.name);
  const updatePostWithId = updatePost.bind(null, postId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Rediger innlegg</h1>
      <PostForm
        action={updatePostWithId}
        categories={allCategories}
        initialValues={{
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          categoryId: post.categoryId,
          status: post.status,
          coverImageKey: post.coverImageKey,
        }}
        submitLabel="Lagre endringer"
      />
    </div>
  );
}
