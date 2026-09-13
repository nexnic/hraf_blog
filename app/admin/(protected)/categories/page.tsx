import { db } from "@/db/client";
import { categories } from "@/db/schema";
import { createCategory, deleteCategory } from "./actions";

export default async function AdminCategoriesPage() {
  const allCategories = await db.select().from(categories).orderBy(categories.name);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Kategorier</h1>

      <form action={createCategory} className="flex flex-col gap-3 max-w-md">
        <label className="flex flex-col gap-1 text-sm">
          Navn
          <input
            name="name"
            required
            className="rounded border border-foreground/10 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Beskrivelse (valgfritt)
          <textarea
            name="description"
            rows={2}
            className="rounded border border-foreground/10 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="self-start rounded bg-primary px-4 py-2 text-sm text-background"
        >
          Legg til kategori
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {allCategories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between rounded border border-foreground/10 px-4 py-2"
          >
            <div>
              <p className="font-medium">{category.name}</p>
              <p className="text-xs opacity-60">/{category.slug}</p>
            </div>
            <form
              action={async () => {
                "use server";
                await deleteCategory(category.id);
              }}
            >
              <button type="submit" className="text-sm text-red-600 underline">
                Slett
              </button>
            </form>
          </li>
        ))}
        {allCategories.length === 0 && (
          <p className="text-sm opacity-60">Ingen kategorier ennå.</p>
        )}
      </ul>
    </div>
  );
}
