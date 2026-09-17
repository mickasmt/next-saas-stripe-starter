import { PageContent } from "@/components/dashboard/page-header"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { SecurityPreview } from "@/components/dashboard/pro/security-preview"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Security",
  noIndex: true,
})

export default function SecuritySettingsPage() {
  return (
    <PageContent>
      <div className="flex flex-col gap-6">
        <ProBanner
          title="Account security is included in Pro"
          description="This page shows sample data. Pro ships the working code: password changes, two-factor and session revocation."
        />
        <SecurityPreview />
      </div>
    </PageContent>
  )
}
