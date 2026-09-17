import { PageContent } from "@/components/dashboard/page-header"
import { GeneralSettingsForm } from "@/components/dashboard/settings/general-settings-form"
import { isOrganizationManager } from "@/lib/auth/roles"
import { getActiveOrganization } from "@/lib/auth/session"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Settings",
  noIndex: true,
})

export default async function GeneralSettingsPage() {
  const { organization, member } = await getActiveOrganization()

  return (
    <PageContent>
      <GeneralSettingsForm
        organization={{
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo ?? null,
        }}
        canEdit={isOrganizationManager(member.role)}
      />
    </PageContent>
  )
}
