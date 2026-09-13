import type { postStatusValues } from "@/db/schema";
import ImageUploader from "./ImageUploader";

export interface PostFormCategory {
  id: number;
  name: string;
}

export interface PostFormInitialValues {
  title?: string;
  excerpt?: string | null;
  content?: string;
  categoryId?: number | null;
  status?: (typeof postStatusValues)[number];
  coverImageKey?: string | null;
}

export default function PostForm({
  action,
  categories,
  initialValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  categories: PostFormCategory[];
  initialValues?: PostFormInitialValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Tittel
        <input
          name="title"
          required
          defaultValue={initialValues?.title}
          className="rounded border border-foreground/10 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Ingress (valgfritt)
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={initialValues?.excerpt ?? ""}
          className="rounded border border-foreground/10 px-3 py-2"
        />
      </label>

      <ImageUploader defaultValue={initialValues?.coverImageKey} />

      <label className="flex flex-col gap-1 text-sm">
        Innhold (markdown)
        <textarea
          name="content"
          rows={16}
          defaultValue={initialValues?.content ?? ""}
          className="rounded border border-foreground/10 px-3 py-2 font-mono text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Kategori
        <select
          name="categoryId"
          defaultValue={initialValues?.categoryId ?? ""}
          className="rounded border border-foreground/10 px-3 py-2"
        >
          <option value="">Ingen</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Status
        <select
          name="status"
          defaultValue={initialValues?.status ?? "draft"}
          className="rounded border border-foreground/10 px-3 py-2"
        >
          <option value="draft">Kladd</option>
          <option value="published">Publisert</option>
        </select>
      </label>

      <button
        type="submit"
        className="self-start rounded bg-primary px-4 py-2 text-sm text-background"
      >
        {submitLabel}
      </button>
    </form>
  );
}
