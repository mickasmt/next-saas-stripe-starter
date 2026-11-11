import { eq } from "drizzle-orm"
import { headers } from "next/headers"

import { isOrganizationManager } from "@/lib/auth/roles"
import { auth } from "@/lib/auth/server"
import { getSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import { organization } from "@/lib/db/schema"
import { isFeatureEnabled } from "@/lib/features/resolve"
import { readImage } from "@/modules/uploads/images"
import {
  avatarPrefix,
  bestEffort,
  deleteFiles,
  fileUrl,
  keyFromUrl,
  logoPrefix,
  putFile,
} from "@/modules/uploads/storage"
import { isUploadTarget } from "@/modules/uploads/targets"

function error(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

// Uploads go through the server rather than a presigned URL: avatars are
// small, and the server can check the bytes before anything is stored.
export async function POST(
  request: Request,
  ctx: RouteContext<"/api/uploads/[target]">
) {
  if (!(await isFeatureEnabled("uploads"))) return error("Not found", 404)

  const { target } = await ctx.params
  if (!isUploadTarget(target)) return error("Not found", 404)

  const session = await getSession()
  if (!session) return error("Sign in to upload files.", 401)

  const form = await request.formData().catch(() => null)
  const image = await readImage(form?.get("file") ?? null)
  if ("error" in image) return error(image.error, 400)

  const requestHeaders = await headers()
  const name = `${crypto.randomUUID()}.${image.extension}`

  if (target === "avatar") {
    const key = avatarPrefix(session.user.id) + name
    await putFile(key, image.bytes, image.type)
    await auth.api.updateUser({
      headers: requestHeaders,
      body: { image: fileUrl(key) },
    })

    const previous = keyFromUrl(session.user.image)
    if (previous && previous !== key) {
      await bestEffort("removing the previous avatar", () =>
        deleteFiles([previous])
      )
    }

    return Response.json({ url: fileUrl(key) })
  }

  // Organization logo: the active organization only, owners and admins only.
  const organizationId = session.session.activeOrganizationId
  if (!organizationId) return error("No active organization.", 400)

  const member = await auth.api.getActiveMember({ headers: requestHeaders })
  if (!member || !isOrganizationManager(member.role)) {
    return error("Only owners and admins can change the logo.", 403)
  }

  const [current] = await db
    .select({ logo: organization.logo })
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1)

  const key = logoPrefix(organizationId) + name
  await putFile(key, image.bytes, image.type)
  await auth.api.updateOrganization({
    headers: requestHeaders,
    body: { organizationId, data: { logo: fileUrl(key) } },
  })

  const previous = keyFromUrl(current?.logo)
  if (previous && previous !== key) {
    await bestEffort("removing the previous logo", () =>
      deleteFiles([previous])
    )
  }

  return Response.json({ url: fileUrl(key) })
}
