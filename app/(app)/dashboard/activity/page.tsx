import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { ActivityPreview } from "@/components/dashboard/pro/activity-preview"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Activity",
  noIndex: true,
})

export default function ActivityPage() {
  return (
    <PageContent>
      <PageHeader
        title="Activity"
        description="Who did what in this organization."
      />
      <div className="flex flex-col gap-6">
        <ProBanner
          title="The audit log is included in Pro"
          description="This page shows sample data. Pro ships the working code: recorded events, filters and CSV export."
        />
        <ActivityPreview />
      </div>
    </PageContent>
  )
}
