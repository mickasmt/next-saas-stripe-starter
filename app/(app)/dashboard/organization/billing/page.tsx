import { PageContent } from "@/components/dashboard/page-header"
import { BillingPreview } from "@/components/dashboard/pro/billing-preview"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { requireFeature } from "@/lib/features/guard"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Billing",
  noIndex: true,
})

export default async function OrganizationBillingPage() {
  await requireFeature("billing")

  return (
    <PageContent>
      <div className="flex flex-col gap-6">
        <ProBanner
          title="Billing details are included in Pro"
          description="This page shows sample data. Pro ships the working code: payment method, billing email, address and tax ID."
        />
        <BillingPreview />
      </div>
    </PageContent>
  )
}
