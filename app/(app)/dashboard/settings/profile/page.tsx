import { PageContent } from "@/components/dashboard/page-header"
import { ProfileSettingsForm } from "@/components/dashboard/settings/profile-settings-form"
import { requireSession } from "@/lib/auth/session"
import { isFeatureEnabled } from "@/lib/features/resolve" // module:uploads
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Profile",
  noIndex: true,
})

export default async function ProfileSettingsPage() {
  const { user } = await requireSession()
  const canUpload = await isFeatureEnabled("uploads") // module:uploads

  return (
    <PageContent>
      <ProfileSettingsForm
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image ?? null,
        }}
        canUpload={canUpload} // module:uploads
      />
    </PageContent>
  )
}
