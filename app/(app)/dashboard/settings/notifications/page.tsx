import { PageContent } from "@/components/dashboard/page-header"
import { NotificationsPreview } from "@/components/dashboard/pro/notifications-preview"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Notifications",
  noIndex: true,
})

export default function NotificationsSettingsPage() {
  return (
    <PageContent>
      <div className="flex flex-col gap-6">
        <ProBanner
          title="Email notifications are included in Pro"
          description="This page shows sample data. Pro ships the working code: transactional emails, templates and per-user preferences."
        />
        <NotificationsPreview />
      </div>
    </PageContent>
  )
}
