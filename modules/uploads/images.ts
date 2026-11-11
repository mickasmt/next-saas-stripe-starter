import "server-only"

import {
  imageTypes,
  MAX_IMAGE_BYTES,
  type ImageType,
} from "@/modules/uploads/targets"

export type ValidImage = {
  bytes: Uint8Array
  type: ImageType
  extension: string
}

// The browser-reported type is only a claim: the first bytes decide. Combined
// with `nosniff` on the files route, nothing but an image is ever served.
function sniff(bytes: Uint8Array): ImageType | null {
  const starts = (...sig: number[]) => sig.every((b, i) => bytes[i] === b)
  const ascii = (offset: number, text: string) =>
    [...text].every((c, i) => bytes[offset + i] === c.charCodeAt(0))

  if (starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png"
  if (starts(0xff, 0xd8, 0xff)) return "image/jpeg"
  if (ascii(0, "GIF87a") || ascii(0, "GIF89a")) return "image/gif"
  if (ascii(0, "RIFF") && ascii(8, "WEBP")) return "image/webp"
  return null
}

export async function readImage(
  file: FormDataEntryValue | null
): Promise<ValidImage | { error: string }> {
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Images must be 2 MB or smaller." }
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const type = sniff(bytes)
  if (!type) {
    return { error: "Use a PNG, JPEG, WebP or GIF image." }
  }

  return { bytes, type, extension: imageTypes[type] }
}
