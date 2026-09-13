import { db } from "@/db/client";
import { categories } from "@/db/schema";
import PostForm from "@/components/admin/PostForm";
import { createPost } from "../actions";

export default async function NewPostPage() {
  const allCategories = await db.select().from(categories).orderBy(categories.name);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Nytt innlegg</h1>
      <PostForm action={createPost} categories={allCategories} submitLabel="Opprett innlegg" />
    </div>
  );
}
