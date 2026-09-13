import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getImageStore, buildImageKey } from "@/lib/blobs/store";
import { resizeForUpload } from "@/lib/blobs/resize";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const input = Buffer.from(await file.arrayBuffer());
  const { full, thumbnail } = await resizeForUpload(input);

  const key = buildImageKey("webp");
  const thumbnailKey = key.replace(/\.webp$/, "-thumb.webp");

  const store = getImageStore();
  await Promise.all([
    store.set(key, new Blob([new Uint8Array(full)]), { metadata: { contentType: "image/webp" } }),
    store.set(thumbnailKey, new Blob([new Uint8Array(thumbnail)]), {
      metadata: { contentType: "image/webp" },
    }),
  ]);

  return NextResponse.json({ data: { key, thumbnailKey } });
}
