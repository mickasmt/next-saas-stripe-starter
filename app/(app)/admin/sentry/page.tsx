import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { SentryPreview } from "@/components/dashboard/pro/sentry-preview"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Sentry",
  noIndex: true,
})

export default function SentryPage() {
  return (
    <PageContent>
      <PageHeader
        title="Sentry"
        description="Error and performance monitoring."
      />
      <div className="flex flex-col gap-6">
        <ProBanner
          title="Error tracking is included in Pro"
          description="Pro ships the Sentry module: errors and performance monitoring, off until a DSN is set. In the dashboard it links straight to your Sentry project."
        />
        <SentryPreview />
      </div>
    </PageContent>
  )
}
