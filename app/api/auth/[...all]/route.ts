import { toNextJsHandler } from "better-auth/next-js"

import type { FeatureKey } from "@/config/features"
import { auth } from "@/lib/auth/server"
import { getFeatures } from "@/lib/features/resolve"

const handler = toNextJsHandler(auth)

// Better Auth plugins register their endpoints whether or not their module is
// on. Layouts only hide pages, so the endpoints are gated here.
const pluginRoutes: { prefix: string; feature: FeatureKey }[] = [
  { prefix: "/api/auth/subscription/", feature: "billing" },
  { prefix: "/api/auth/stripe/", feature: "billing" },
]

async function isAllowed(request: Request) {
  const features = await getFeatures()
  if (!features.auth) return false

  const { pathname } = new URL(request.url)
  // User management endpoints ship with Pro: the free admin panel only shows
  // sample data, so nothing here may list, ban or impersonate real users.
  if (pathname.startsWith("/api/auth/admin/")) return false
  return pluginRoutes.every(
    ({ prefix, feature }) => !pathname.startsWith(prefix) || features[feature]
  )
}

export async function GET(request: Request) {
  if (!(await isAllowed(request))) {
    return new Response("Not Found", { status: 404 })
  }
  return handler.GET(request)
}

export async function POST(request: Request) {
  if (!(await isAllowed(request))) {
    return new Response("Not Found", { status: 404 })
  }
  return handler.POST(request)
}
