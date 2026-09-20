import { PageContent } from "@/components/dashboard/page-header"
import { BillingPreview } from "@/components/dashboard/pro/billing-preview"
import { InvoicesPreview } from "@/components/dashboard/pro/invoices-preview"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { requireFeature } from "@/lib/features/guard"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Invoices",
  noIndex: true,
})

export default async function InvoicesPage() {
  await requireFeature("billing")

  return (
    <PageContent>
      <div className="flex flex-col gap-6">
        <ProBanner
          title="Invoices and billing details are included in Pro"
          description="This page shows sample data. Pro ships the working code: the next invoice, invoice history, PDF downloads, and the billing email, address and tax ID."
        />
        <InvoicesPreview />
        <BillingPreview />
      </div>
    </PageContent>
  )
}
