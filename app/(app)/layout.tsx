import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { dashboardNav } from "@/config/nav"
import { getActiveOrganization } from "@/lib/auth/session"
import { requireFeature } from "@/lib/features/guard"
import { getFeatures } from "@/lib/features/resolve"
import { filterNav } from "@/lib/nav"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireFeature("auth")
  // Redirects to /login without a session.
  const { session, organization, member } = await getActiveOrganization()

  const nav = filterNav(dashboardNav, {
    features: await getFeatures(),
    role: session.user.role,
  })

  return (
    <DashboardShell
      nav={nav}
      organization={{
        name: organization.name,
        logo: organization.logo ?? null,
        role: member.role,
      }}
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }}
    >
      {children}
    </DashboardShell>
  )
}
