import Link from "next/link";

export interface PostCardData {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageKey: string | null;
  publishedAt: Date | null;
  categoryName?: string | null;
}

export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="flex flex-col gap-3 border-b border-foreground/10 pb-8">
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
      <h2 className="text-xl font-semibold">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      {post.excerpt && <p className="opacity-80">{post.excerpt}</p>}
    </article>
  );
}
