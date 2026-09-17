import type { Metadata } from "next"
import { headers } from "next/headers"

import { BillingOverview } from "@/components/billing/billing-overview"
import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { siteConfig } from "@/config/site"
import { isOrganizationManager } from "@/lib/auth/roles"
import { auth } from "@/lib/auth/server"
import { getActiveOrganization } from "@/lib/auth/session"
import { plans, type PlanName } from "@/modules/billing/plans"
import { getPlanPrices } from "@/modules/billing/prices"

export const metadata: Metadata = {
  title: `Billing | ${siteConfig.name}`,
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; interval?: string; checkout?: string }>
}) {
  const { organization, member } = await getActiveOrganization()
  const params = await searchParams

  const [subscriptions, prices] = await Promise.all([
    auth.api.listActiveSubscriptions({
      headers: await headers(),
      query: { referenceId: organization.id, customerType: "organization" },
    }),
    getPlanPrices(),
  ])
  const subscription = subscriptions[0]

  // Set by the pricing page when a signed-out visitor picked a paid plan.
  const resumePlan = plans.find((plan) => plan.name === params.plan)?.name

  return (
    <PageContent>
      <PageHeader
        title="Billing"
        description={`Manage the plan and payment details of ${organization.name}.`}
      />
      <BillingOverview
        subscription={
          subscription
            ? {
                plan: subscription.plan as PlanName,
                status: subscription.status,
                interval:
                  subscription.billingInterval === "year" ? "year" : "month",
                periodEnd: subscription.periodEnd?.toISOString() ?? null,
                cancelAt:
                  (subscription.cancelAtPeriodEnd
                    ? subscription.periodEnd
                    : subscription.cancelAt
                  )?.toISOString() ?? null,
              }
            : null
        }
        prices={prices}
        canManage={isOrganizationManager(member.role)}
        resume={
          resumePlan
            ? {
                plan: resumePlan,
                interval: params.interval === "month" ? "month" : "year",
              }
            : null
        }
        checkoutSucceeded={params.checkout === "success"}
      />
    </PageContent>
  )
}
