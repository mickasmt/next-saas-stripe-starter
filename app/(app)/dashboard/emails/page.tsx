import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { EmailsPreview } from "@/components/dashboard/pro/emails-preview"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Emails",
  noIndex: true,
})

export default function EmailsPage() {
  return (
    <PageContent>
      <PageHeader
        title="Emails"
        description="Transactional emails sent by your app."
      />
      <div className="flex flex-col gap-6">
        <ProBanner
          title="Transactional emails are included in Pro"
          description="This page shows sample data. Pro ships the working code: provider setup, a delivery log and one-click resends. The templates have their own page."
        />
        <EmailsPreview />
      </div>
    </PageContent>
  )
}
