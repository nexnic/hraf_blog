import { and, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db/client";
import { categories, posts } from "@/db/schema";
import PostCard from "@/components/public/PostCard";

const PAGE_SIZE = 10;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const rows = await db
    .select({
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      coverImageKey: posts.coverImageKey,
      publishedAt: posts.publishedAt,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.status, "published"), isNotNull(posts.publishedAt)))
    .orderBy(desc(posts.publishedAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-8">
      {rows.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
      {rows.length === 0 && <p className="opacity-60">Ingen innlegg publisert ennå.</p>}

      {(page > 1 || rows.length === PAGE_SIZE) && (
        <nav className="flex justify-between text-sm">
          {page > 1 ? <a href={`/?page=${page - 1}`}>← Nyere</a> : <span />}
          {rows.length === PAGE_SIZE && <a href={`/?page=${page + 1}`}>Eldre →</a>}
        </nav>
      )}
    </div>
  );
}
