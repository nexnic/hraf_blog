import Link from "next/link";
import { db } from "@/db/client";
import { categories } from "@/db/schema";

export default async function Navbar({ siteTitle }: { siteTitle: string }) {
  const allCategories = await db.select().from(categories).orderBy(categories.name);

  return (
    <header className="border-b border-foreground/10">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          {siteTitle}
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm">
          {allCategories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
