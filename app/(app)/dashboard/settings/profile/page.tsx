import type { Metadata } from "next"
import { headers } from "next/headers"

import { PageContent } from "@/components/dashboard/page-header"
import { ProfileSettingsForm } from "@/components/dashboard/settings/profile-settings-form"
import { siteConfig } from "@/config/site"
import { auth } from "@/lib/auth/server"
import { requireSession } from "@/lib/auth/session"

export const metadata: Metadata = {
  title: `Profile | ${siteConfig.name}`,
}

export default async function ProfileSettingsPage() {
  const { user } = await requireSession()
  const accounts = await auth.api.listUserAccounts({ headers: await headers() })

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
        hasPassword={accounts.some(
          (account) => account.providerId === "credential"
        )}
      />
    </PageContent>
  )
}
