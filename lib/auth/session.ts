import "server-only"

import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { cache } from "react"

import { auth } from "@/lib/auth/server"

// Deduplicated per request: layouts, pages and actions can all call it.
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
)

export async function requireSession() {
  const session = await getSession()
  if (!session) redirect("/login")
  return session
}

// Platform role (user.role), not the organization role (member.role).
export async function requireRole(role: "admin") {
  const session = await requireSession()
  const roles = session.user.role?.split(",").map((r) => r.trim()) ?? []
  if (!roles.includes(role)) notFound()
  return session
}

// Always go through this helper to scope data. Never assume an organization
// has a single member, and never pick `memberships[0]` yourself.
export const getActiveOrganization = cache(async () => {
  const session = await requireSession()
  const organizationId = session.session.activeOrganizationId

  if (!organizationId) redirect("/onboarding")

  const [organization, member] = await Promise.all([
    auth.api.getFullOrganization({
      headers: await headers(),
      query: { organizationId },
    }),
    auth.api.getActiveMember({ headers: await headers() }),
  ])

  if (!organization || !member) redirect("/onboarding")

  return { session, organization, member }
})
