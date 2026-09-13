import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { db } from "@/db/client";
import { categories, posts } from "@/db/schema";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post] = await db
    .select({
      title: posts.title,
      content: posts.content,
      coverImageKey: posts.coverImageKey,
      publishedAt: posts.publishedAt,
      categoryName: categories.name,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);

  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-6">
      <div className="flex items-center gap-3 text-xs opacity-60">
        {post.categoryName && <span>{post.categoryName}</span>}
        {post.publishedAt && (
          <time dateTime={post.publishedAt.toISOString()}>
            {post.publishedAt.toLocaleDateString("nb-NO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
      </div>
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      {post.coverImageKey && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/images/${post.coverImageKey}`}
          alt=""
          width={768}
          height={400}
          className="aspect-[2/1] w-full rounded object-cover"
        />
      )}
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
