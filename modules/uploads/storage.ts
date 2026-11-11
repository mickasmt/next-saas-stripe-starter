// No `import "server-only"`: lib/auth/server.ts imports this file for its
// cleanup hooks, and the Better Auth CLI loads that file outside Next.js.
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"

import { foundation } from "@/config/foundation"

// Neon Object Storage speaks the S3 API. The bucket is declared in neon.ts;
// `neon deploy` creates it and writes the AWS_* variables to .env.
export const UPLOADS_BUCKET = process.env.NEON_STORAGE_BUCKET || "uploads"

// Files are served by app/api/files, never from the bucket directly, so the
// bucket stays private and the stored URL works on every branch and domain.
export const FILES_ROUTE = "/api/files"

// Top-level prefixes the files route is allowed to serve.
export const servedPrefixes = ["avatars", "logos"] as const

export function isStorageConfigured() {
  return foundation.storage.requiredEnv.every((name) => process.env[name])
}

const globalForStorage = globalThis as unknown as { s3?: S3Client }

function client() {
  globalForStorage.s3 ??= new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
    forcePathStyle: true,
    // Recent SDKs add checksums Neon's endpoint doesn't expect.
    requestChecksumCalculation: "WHEN_REQUIRED",
  })
  return globalForStorage.s3
}

export function avatarPrefix(userId: string) {
  return `avatars/${userId}/`
}

export function logoPrefix(organizationId: string) {
  return `logos/${organizationId}/`
}

export function fileUrl(key: string) {
  return `${FILES_ROUTE}/${key}`
}

// The object key behind a URL produced by fileUrl, or null for any other URL
// (a Google avatar, an external logo...).
export function keyFromUrl(url: string | null | undefined) {
  const prefix = `${FILES_ROUTE}/`
  return url?.startsWith(prefix) ? url.slice(prefix.length) : null
}

export async function putFile(
  key: string,
  body: Uint8Array,
  contentType: string
) {
  await client().send(
    new PutObjectCommand({
      Bucket: UPLOADS_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
}

export async function getFile(key: string) {
  try {
    return await client().send(
      new GetObjectCommand({ Bucket: UPLOADS_BUCKET, Key: key })
    )
  } catch (error) {
    if (error instanceof NoSuchKey) return null
    throw error
  }
}

export async function deleteFiles(keys: string[]) {
  if (keys.length === 0) return
  await client().send(
    new DeleteObjectsCommand({
      Bucket: UPLOADS_BUCKET,
      Delete: { Objects: keys.map((Key) => ({ Key })), Quiet: true },
    })
  )
}

export async function deleteFilesByPrefix(prefix: string) {
  let token: string | undefined
  do {
    const page = await client().send(
      new ListObjectsV2Command({
        Bucket: UPLOADS_BUCKET,
        Prefix: prefix,
        ContinuationToken: token,
      })
    )
    await deleteFiles(
      (page.Contents ?? []).flatMap((object) =>
        object.Key ? [object.Key] : []
      )
    )
    token = page.IsTruncated ? page.NextContinuationToken : undefined
  } while (token)
}

// Cleanup that must never block the action that triggered it (deleting an
// account, replacing an avatar): a leftover file is cheaper than a failure.
export async function bestEffort(label: string, task: () => Promise<void>) {
  if (!isStorageConfigured()) return
  try {
    await task()
  } catch (error) {
    console.error(`[uploads] ${label} failed`, error)
  }
}
