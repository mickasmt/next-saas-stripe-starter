import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

// 1x1 transparent pixel, used when the file is missing or can't be decoded.
const FALLBACK =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

const cache = new Map<string, string>()

// Tiny base64 preview for next/image's `placeholder="blur"`. Reads the file
// straight from /public, so it works at build time and offline.
export async function getBlurDataURL(src?: string | null) {
  if (!src || !src.startsWith("/")) return FALLBACK

  const cached = cache.get(src)
  if (cached) return cached

  try {
    const file = await readFile(path.join(process.cwd(), "public", src))
    const preview = await sharp(file)
      .resize(16, 16, { fit: "inside" })
      .webp({ quality: 60 })
      .toBuffer()

    const dataURL = `data:image/webp;base64,${preview.toString("base64")}`
    cache.set(src, dataURL)
    return dataURL
  } catch {
    return FALLBACK
  }
}
