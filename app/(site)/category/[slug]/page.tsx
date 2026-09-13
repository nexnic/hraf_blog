import { and, desc, eq, isNotNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { categories, posts } from "@/db/schema";
import PostCard from "@/components/public/PostCard";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (!category) {
    notFound();
  }

  const rows = await db
    .select({
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      coverImageKey: posts.coverImageKey,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(
      and(
        eq(posts.categoryId, category.id),
        eq(posts.status, "published"),
        isNotNull(posts.publishedAt),
      ),
    )
    .orderBy(desc(posts.publishedAt));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">{category.name}</h1>
        {category.description && <p className="opacity-70">{category.description}</p>}
      </div>
      {rows.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
      {rows.length === 0 && <p className="opacity-60">Ingen innlegg i denne kategorien ennå.</p>}
    </div>
  );
}
