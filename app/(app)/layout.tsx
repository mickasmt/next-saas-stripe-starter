import { Geist } from "next/font/google"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { dashboardNav, navPanels } from "@/config/nav"
import { getActiveOrganization } from "@/lib/auth/session"
import { requireFeature } from "@/lib/features/guard"
import { getFeatures } from "@/lib/features/resolve"
import { filterNav, filterPanels } from "@/lib/nav"
import { getViewRole } from "@/modules/admin/preview" // module:admin

// Dashboard-only font; marketing keeps its own.
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireFeature("auth")
  // Redirects to /login without a session.
  const { session, organization, member } = await getActiveOrganization()

  const features = await getFeatures()
  const viewer = { role: session.user.role }
  // module:admin start
  // Demo preview swaps the role shown in the nav, never the one in the DB.
  viewer.role = await getViewRole(session)
  // module:admin end
  const nav = filterNav(dashboardNav, { features, role: viewer.role })
  const panels = filterPanels(navPanels, { features, role: viewer.role })

  return (
    <DashboardShell
      className={geist.variable}
      nav={nav}
      panels={panels}
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
