import type { Metadata } from "next"

import { UsersPreview } from "@/components/admin/users-preview"
import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: `Admin | ${siteConfig.name}`,
}

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
