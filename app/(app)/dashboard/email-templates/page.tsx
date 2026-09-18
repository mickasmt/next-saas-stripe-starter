import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { EmailTemplatesPreview } from "@/components/dashboard/pro/email-templates-preview"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Email templates",
  noIndex: true,
})

export default function EmailTemplatesPage() {
  return (
    <PageContent>
      <PageHeader
        title="Email templates"
        description="Every email your app can send, and what triggers it."
      />
      <div className="flex flex-col gap-6">
        <ProBanner
          title="Email templates are included in Pro"
          description="This page shows sample data. Pro ships the working code: React Email templates, a local preview and your branding applied across all of them."
        />
        <EmailTemplatesPreview />
      </div>
    </PageContent>
  )
}
