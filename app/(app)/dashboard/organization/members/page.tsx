import { PageContent } from "@/components/dashboard/page-header"
import { MembersPreview } from "@/components/dashboard/pro/members-preview"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Members",
  noIndex: true,
})

export default function OrganizationMembersPage() {
  return (
    <PageContent>
      <div className="flex flex-col gap-6">
        <ProBanner
          title="Team management is included in Pro"
          description="This page shows sample data. Pro ships the working code: invitations, roles, seats and leaving a team."
        />
        <MembersPreview />
      </div>
    </PageContent>
  )
}
