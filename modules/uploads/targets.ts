// Shared by the upload button (client) and the upload route (server).

export const uploadTargets = ["avatar", "logo"] as const

export type UploadTarget = (typeof uploadTargets)[number]

export function isUploadTarget(value: unknown): value is UploadTarget {
  return uploadTargets.includes(value as UploadTarget)
}

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024

// SVG is left out on purpose: it can carry scripts.
export const imageTypes = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
} as const

export type ImageType = keyof typeof imageTypes

export const acceptedImageTypes = Object.keys(imageTypes).join(",")
