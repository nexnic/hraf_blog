import "server-only";
import sharp from "sharp";

export interface ResizedImage {
  full: Buffer;
  thumbnail: Buffer;
}

export async function resizeForUpload(input: Buffer): Promise<ResizedImage> {
  const [full, thumbnail] = await Promise.all([
    sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer(),
    sharp(input).rotate().resize({ width: 400, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(),
  ]);

  return { full, thumbnail };
}
