import "server-only";
import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";

export function getImageStore() {
  return getStore("images");
}

export function buildImageKey(extension: string) {
  return `posts/${randomUUID()}.${extension}`;
}
