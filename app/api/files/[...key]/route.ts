import { isFeatureEnabled } from "@/lib/features/resolve"
import { getFile, servedPrefixes } from "@/modules/uploads/storage"
import { imageTypes } from "@/modules/uploads/targets"

const SEGMENT = /^[\w-]+(\.[a-z0-9]+)?$/i

// Serves uploaded images out of the private bucket. Keys hold a random UUID
// and never change once written, so responses are cached for good.
export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/files/[...key]">
) {
  if (!(await isFeatureEnabled("uploads"))) {
    return new Response("Not Found", { status: 404 })
  }

  const { key: segments } = await ctx.params
  const allowed =
    servedPrefixes.includes(segments[0] as (typeof servedPrefixes)[number]) &&
    segments.every((segment) => SEGMENT.test(segment))
  if (!allowed) return new Response("Not Found", { status: 404 })

  const object = await getFile(segments.join("/"))
  if (!object?.Body) return new Response("Not Found", { status: 404 })

  const type = object.ContentType ?? ""
  const contentType = Object.hasOwn(imageTypes, type)
    ? type
    : "application/octet-stream"

  return new Response(object.Body.transformToWebStream(), {
    headers: {
      "Content-Type": contentType,
      ...(object.ContentLength !== undefined && {
        "Content-Length": String(object.ContentLength),
      }),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  })
}
