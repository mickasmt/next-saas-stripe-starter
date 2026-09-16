import type { Metadata } from "next"

import { GeneralSettingsForm } from "@/components/dashboard/settings/general-settings-form"
import { PageContent } from "@/components/dashboard/page-header"
import { siteConfig } from "@/config/site"
import { getActiveOrganization } from "@/lib/auth/session"

export const metadata: Metadata = {
  title: `Settings | ${siteConfig.name}`,
}

const MANAGER_ROLES = new Set(["owner", "admin"])

export default async function GeneralSettingsPage() {
  const { organization, member } = await getActiveOrganization()

  return (
    <PageContent>
      <GeneralSettingsForm
        organization={{
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        }}
        canEdit={MANAGER_ROLES.has(member.role)}
      />
    </PageContent>
  )
}
