import fs from "node:fs";
import path from "node:path";

const PHOTO_DIR = path.join(process.cwd(), "public", "instagram");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

/**
 * The photo feed, read from disk at build time.
 *
 * This used to be a hardcoded array that had to be kept in sync with
 * public/instagram/ by hand — and drifted the moment photos were deleted,
 * leaving broken <img> requests behind. Deriving it from the directory means
 * adding or removing a file is the whole operation.
 *
 * Server-only: this must be called from a server component (page.tsx) and the
 * result passed down, never imported into a "use client" module.
 */
export function getPhotos(): string[] {
  try {
    return fs
      .readdirSync(PHOTO_DIR)
      .filter((f) => IMAGE_EXT.test(f))
      .sort();
  } catch {
    // Missing directory shouldn't take the whole page down.
    return [];
  }
}
