import { Geist } from "next/font/google"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { dashboardNav, settingsNav } from "@/config/nav"
import { getActiveOrganization } from "@/lib/auth/session"
import { requireFeature } from "@/lib/features/guard"
import { getFeatures } from "@/lib/features/resolve"
import { filterNav } from "@/lib/nav"

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
  const nav = filterNav(dashboardNav, { features, role: session.user.role })
  const settings = filterNav(settingsNav, { features, role: session.user.role })

  return (
    <DashboardShell
      className={geist.variable}
      nav={nav}
      settingsNav={settings}
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
