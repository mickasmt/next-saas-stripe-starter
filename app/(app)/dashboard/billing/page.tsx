import { headers } from "next/headers"

import { BillingOverview } from "@/components/billing/billing-overview"
import { PageContent, PageHeader } from "@/components/dashboard/page-header"
import { isOrganizationManager, isPlatformAdmin } from "@/lib/auth/roles"
import { auth } from "@/lib/auth/server"
import { getActiveOrganization } from "@/lib/auth/session"
import { buildMetadata } from "@/lib/metadata"
import { plans, type PlanName } from "@/modules/billing/plans"
import { getPlanPrices } from "@/modules/billing/prices"
import {
  getLastEndedSubscription,
  reconcileSubscription,
} from "@/modules/billing/sync"

export const metadata = buildMetadata({
  title: "Billing",
  noIndex: true,
})

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; interval?: string; checkout?: string }>
}) {
  const { session, organization, member } = await getActiveOrganization()
  const adminAccess = isPlatformAdmin(session.user.role)
  const params = await searchParams

  const [subscriptions, prices] = await Promise.all([
    auth.api.listActiveSubscriptions({
      headers: await headers(),
      query: { referenceId: organization.id, customerType: "organization" },
    }),
    getPlanPrices(),
  ])
  // The portal's plan-switch flow needs a confirmation click on Stripe's
  // side, and cancellations land through a webhook: reconcile against the
  // live Stripe subscription so a slow or missed event never leaves the
  // page stuck on the old plan.
  const subscription = subscriptions[0]
    ? await reconcileSubscription(subscriptions[0])
    : null
  const lastEndedSubscription = subscription
    ? null
    : await getLastEndedSubscription(organization.id)

  // Set by the pricing page when a signed-out visitor picked a paid plan.
  const resumePlan = adminAccess
    ? undefined
    : plans.find((plan) => plan.name === params.plan)?.name

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
        canceled={
          lastEndedSubscription?.canceledAt
            ? {
                plan: lastEndedSubscription.plan as PlanName,
                canceledAt: lastEndedSubscription.canceledAt.toISOString(),
              }
            : null
        }
        prices={prices}
        canManage={isOrganizationManager(member.role)}
        adminAccess={adminAccess}
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
