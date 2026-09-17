import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { UsagePreview } from "@/components/dashboard/pro/usage-preview"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Usage",
  noIndex: true,
})

export default function UsagePage() {
  return (
    <PageContent>
      <PageHeader
        title="Usage"
        description="What this organization consumed during the current period."
      />
      <div className="flex flex-col gap-6">
        <ProBanner
          title="Usage metering is included in Pro"
          description="This page shows sample data. Pro ships the working code: metered counters, plan limits and overage billing."
        />
        <UsagePreview />
      </div>
    </PageContent>
  )
}
