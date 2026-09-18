import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { OnboardingPreview } from "@/components/dashboard/pro/onboarding-preview"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Onboarding",
  noIndex: true,
})

export default function OnboardingPage() {
  return (
    <PageContent>
      <PageHeader
        title="Onboarding"
        description="Guide new members through their first steps."
      />
      <div className="flex flex-col gap-6">
        <ProBanner
          title="Onboarding is included in Pro"
          description="This page shows sample data. Pro ships the working code: saved progress, resumable steps and a guided first project — as a full page or as a modal over the dashboard."
        />
        <OnboardingPreview />
      </div>
    </PageContent>
  )
}
