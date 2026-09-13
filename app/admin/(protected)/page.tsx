import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { deletePost } from "./posts/actions";

export default async function AdminDashboardPage() {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.updatedAt));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Innlegg</h1>
        <Link
          href="/admin/posts/new"
          className="rounded bg-primary px-4 py-2 text-sm text-background"
        >
          Nytt innlegg
        </Link>
      </div>

      <ul className="flex flex-col gap-2">
        {allPosts.map((post) => (
          <li
            key={post.id}
            className="flex items-center justify-between rounded border border-foreground/10 px-4 py-3"
          >
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-xs opacity-60">
                /{post.slug} · {post.status === "published" ? "Publisert" : "Kladd"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/posts/${post.id}/edit`} className="text-sm underline">
                Rediger
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deletePost(post.id);
                }}
              >
                <button type="submit" className="text-sm text-red-600 underline">
                  Slett
                </button>
              </form>
            </div>
          </li>
        ))}
        {allPosts.length === 0 && (
          <p className="text-sm opacity-60">Ingen innlegg ennå.</p>
        )}
      </ul>
    </div>
  );
}
