import "server-only"

import { headers } from "next/headers"

import { isOrganizationManager } from "@/lib/auth/roles"
import { auth } from "@/lib/auth/server"
import { getSession } from "@/lib/auth/session"
import type { PlanName } from "@/modules/billing/plans"
import type { BillingViewer } from "@/modules/billing/pricing"

export async function getBillingViewer(): Promise<BillingViewer> {
  const session = await getSession()
  const organizationId = session?.session.activeOrganizationId
  if (!session) return { signedIn: false }
  if (!organizationId) {
    return { signedIn: true, canManage: false, subscription: null }
  }

  const requestHeaders = await headers()
  const [member, subscriptions] = await Promise.all([
    auth.api.getActiveMember({ headers: requestHeaders }),
    auth.api.listActiveSubscriptions({
      headers: requestHeaders,
      query: { referenceId: organizationId, customerType: "organization" },
    }),
  ])
  const subscription = subscriptions[0]

  return {
    signedIn: true,
    canManage: member ? isOrganizationManager(member.role) : false,
    subscription: subscription
      ? {
          plan: subscription.plan as PlanName,
          interval: subscription.billingInterval === "year" ? "year" : "month",
        }
      : null,
  }
}
