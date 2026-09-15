import { ShieldCheck } from "lucide-react"
import type { Metadata } from "next"

import { EmptyState } from "@/components/dashboard/empty-state"
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
      <EmptyState
        icon={ShieldCheck}
        title="No users to show yet"
        description="User management for platform admins will show up here."
      />
    </PageContent>
  )
}
