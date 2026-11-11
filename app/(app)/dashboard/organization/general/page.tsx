import { PageContent } from "@/components/dashboard/page-header"
import { GeneralSettingsForm } from "@/components/dashboard/settings/general-settings-form"
import { isOrganizationManager } from "@/lib/auth/roles"
import { getActiveOrganization } from "@/lib/auth/session"
import { isFeatureEnabled } from "@/lib/features/resolve" // module:uploads
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "General",
  noIndex: true,
})

export default async function OrganizationGeneralPage() {
  const { organization, member } = await getActiveOrganization()
  const canUpload = await isFeatureEnabled("uploads") // module:uploads

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
        canUpload={canUpload} // module:uploads
      />
    </PageContent>
  )
}
