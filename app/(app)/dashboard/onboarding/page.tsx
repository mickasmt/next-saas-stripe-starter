import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { ProShot } from "@/components/dashboard/pro/pro-shot"
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
          description="A full-screen first-run flow on its own routes — one URL per step, so back and refresh both work. Progress is saved on the account and resumes where the member left it, and the finished checklist comes back as a dismissible dashboard card."
        />
        <ProShot
          src="/_static/pro/onboarding-light.webp"
          darkSrc="/_static/pro/onboarding-dark.webp"
          alt="The organization step of the Pro onboarding flow: a centered form with an organization name and slug, and a Continue button."
          width={1280}
          height={760}
          caption="A screenshot of the Pro app. Steps: welcome, organization, invite your team, pick a plan, then a setup checklist."
        />
      </div>
    </PageContent>
  )
}
