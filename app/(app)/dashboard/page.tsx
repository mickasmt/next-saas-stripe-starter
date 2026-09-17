import { Blocks } from "lucide-react"

import { DemoBanner } from "@/components/admin/demo-banner" // module:admin
import { EmptyState } from "@/components/dashboard/empty-state"
import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { getActiveOrganization } from "@/lib/auth/session"
import { isFeatureEnabled } from "@/lib/features/resolve" // module:admin
import { buildMetadata } from "@/lib/metadata"
import { getViewRole, isDemoMode } from "@/modules/admin/preview" // module:admin

export const metadata = buildMetadata({
  title: "Overview",
  noIndex: true,
})

export default async function DashboardPage() {
  const { session, organization, member } = await getActiveOrganization()

  // module:admin start
  const showDemoBanner = isDemoMode() && (await isFeatureEnabled("admin"))
  const viewRole = await getViewRole(session)
  // module:admin end

  const stats = [
    { label: "Organization", value: organization.name },
    { label: "Members", value: organization.members.length },
    { label: "Your role", value: member.role },
  ]

  return (
    <PageContent>
      {/* module:admin start */}
      {showDemoBanner && <DemoBanner role={viewRole} />}
      {/* module:admin end */}
      <PageHeader
        title={`Welcome back, ${session.user.name.split(" ")[0]}`}
        description="Here's what's happening in your organization."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-5">
            <p className="text-muted-foreground">{stat.label}</p>
            <p className="mt-1 truncate text-2xl font-semibold tracking-[-0.04em] capitalize">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <EmptyState
          icon={Blocks}
          title="Start building your product"
          description="This is your dashboard. Replace this page with the core of your SaaS."
        />
      </div>
    </PageContent>
  )
}
