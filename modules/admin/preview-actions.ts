"use server"

import { cookies } from "next/headers"

import { requireSession } from "@/lib/auth/session"
import { assertFeature } from "@/lib/features/guard"
import {
  isDemoMode,
  PREVIEW_ROLE_COOKIE,
  type PreviewRole,
} from "@/modules/admin/preview"

// Never touches user.role: the preview lives in a browser-session cookie.
export async function setPreviewRole(role: PreviewRole) {
  if (!isDemoMode()) throw new Error("Demo mode is off")
  await assertFeature("admin")
  if (role !== "admin" && role !== "user") throw new Error("Unknown role")
  const session = await requireSession()

  const cookieStore = await cookies()
  // No maxAge: the browser drops it when it closes.
  cookieStore.set(PREVIEW_ROLE_COOKIE, `${session.session.id}:${role}`, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}
