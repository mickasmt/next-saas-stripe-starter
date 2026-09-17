import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { ApiKeysPreview } from "@/components/dashboard/pro/api-keys-preview"
import { ProBanner } from "@/components/dashboard/pro/pro-banner"
import { buildMetadata } from "@/lib/metadata"

export const metadata = buildMetadata({
  title: "API keys",
  noIndex: true,
})

export default function ApiKeysPage() {
  return (
    <PageContent>
      <PageHeader
        title="API keys"
        description="Authenticate requests made on behalf of your organization."
      />
      <div className="flex flex-col gap-6">
        <ProBanner
          title="API keys are included in Pro"
          description="This page shows sample data. Pro ships the working code: hashed keys, scopes, rate limits and revocation."
        />
        <ApiKeysPreview />
      </div>
    </PageContent>
  )
}
