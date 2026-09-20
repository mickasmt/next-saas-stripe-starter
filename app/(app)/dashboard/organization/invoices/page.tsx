import { PageContent } from "@/components/dashboard/page-header"
import { InvoicesPreview } from "@/components/dashboard/pro/invoices-preview"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { requireFeature } from "@/lib/features/guard"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "Invoices",
  noIndex: true,
})

export default async function OrganizationInvoicesPage() {
  await requireFeature("billing")

  return (
    <PageContent>
      <div className="flex flex-col gap-6">
        <ProBanner
          title="Invoices are included in Pro"
          description="This page shows sample data. Pro ships the working code: the next invoice, invoice history and PDF downloads."
        />
        <InvoicesPreview />
      </div>
    </PageContent>
  )
}
