"use server"

import { cookies } from "next/headers"

import { isFeatureKey } from "@/config/features"
import {
  FEATURE_OVERRIDES_COOKIE,
  getDevOverrides,
} from "@/lib/features/resolve"

// Server actions stay reachable in production builds even when the panel
// isn't rendered, so each one refuses to run outside development.
function assertDevelopment() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Feature overrides are only available in development")
  }
}

// Applies several overrides in one cookie write, so a module and the modules
// it depends on switch together. `null` removes an override and falls back to
// the config default.
export async function setFeatureOverrides(
  patch: Record<string, boolean | null>
) {
  assertDevelopment()
  const overrides = await getDevOverrides()
  for (const [key, enabled] of Object.entries(patch)) {
    if (!isFeatureKey(key)) throw new Error(`Unknown feature "${key}"`)
    if (enabled === null) delete overrides[key]
    else overrides[key] = enabled
  }

  const cookieStore = await cookies()
  if (Object.keys(overrides).length === 0) {
    cookieStore.delete(FEATURE_OVERRIDES_COOKIE)
    return
  }
  cookieStore.set(FEATURE_OVERRIDES_COOKIE, JSON.stringify(overrides), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  })
}

export async function resetFeatureOverrides() {
  assertDevelopment()
  ;(await cookies()).delete(FEATURE_OVERRIDES_COOKIE)
}
