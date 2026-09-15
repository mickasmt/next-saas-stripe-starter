import { CreditCard } from "lucide-react"
import type { Metadata } from "next"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: `Billing | ${siteConfig.name}`,
}

export default function BillingPage() {
  return (
    <PageContent>
      <PageHeader
        title="Billing"
        description="Manage your plan and payment details."
      />
      <EmptyState
        icon={CreditCard}
        title="No active subscription"
        description="Plans and the Stripe customer portal will show up here."
      />
    </PageContent>
  )
}
