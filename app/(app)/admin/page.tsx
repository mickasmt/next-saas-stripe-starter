import { UsersPreview } from "@/components/admin/users-preview"
import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Admin",
  noIndex: true,
})

export default function AdminPage() {
  return (
    <PageContent>
      <PageHeader
        title="Admin panel"
        description="Manage users across the platform."
      />
      <UsersPreview />
    </PageContent>
  )
}
