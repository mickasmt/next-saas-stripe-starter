import "server-only"

import { cookies } from "next/headers"

import { isPlatformAdmin } from "@/lib/auth/roles"
import type { Session } from "@/lib/auth/server"

export const PREVIEW_ROLE_COOKIE = "demo-role"

export type PreviewRole = "admin" | "user"

// Live demo only. Safe if left on: the preview unlocks sample data, nothing else.
export function isDemoMode() {
  return process.env.DEMO_MODE === "true"
}

// Cookie holds "<sessionId>:<role>", so signing in again resets the role.
export async function getPreviewRole(
  session: Session
): Promise<PreviewRole | null> {
  if (!isDemoMode()) return null
  const cookieStore = await cookies()
  const [sessionId, role] =
    cookieStore.get(PREVIEW_ROLE_COOKIE)?.value.split(":") ?? []
  if (sessionId !== session.session.id) return null
  return role === "admin" || role === "user" ? role : null
}

// The role the dashboard is shown with. Never used for billing or the DB.
export async function getViewRole(session: Session): Promise<PreviewRole> {
  const preview = await getPreviewRole(session)
  if (preview) return preview
  return isPlatformAdmin(session.user.role) ? "admin" : "user"
}

export async function canViewAdmin(session: Session) {
  return (await getViewRole(session)) === "admin"
}
