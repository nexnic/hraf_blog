"use client";

import { useState } from "react";

export default function ImageUploader({
  defaultValue,
}: {
  defaultValue?: string | null;
}) {
  const [key, setKey] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/uploads", { method: "POST", body: formData });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(body.error ?? "Opplasting feilet");
      setUploading(false);
      return;
    }

    setKey(body.data.key);
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2 text-sm">
      Toppbilde
      <input type="hidden" name="coverImageKey" value={key} />
      {key && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/images/${key}`}
          alt=""
          width={320}
          height={180}
          className="rounded border border-foreground/10 object-cover"
        />
      )}
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} />
      {uploading && <p className="opacity-60">Laster opp…</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
