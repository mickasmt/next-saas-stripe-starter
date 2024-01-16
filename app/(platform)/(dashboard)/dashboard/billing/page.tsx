import { redirect } from "next/navigation"

import { getUserSubscriptionPlan } from "@/lib/stripe/subscription"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BillingInfo } from "@/components/billing-info"
import { DashboardHeader } from "@/components/dashboard/header"
import { Icons } from "@/components/shared/icons"
import { DashboardShell } from "@/components/dashboard/shell"
import { checkAuth, getUserAuth } from "@/lib/auth"

export const metadata = {
  title: "Billing",
  description: "Manage billing and your subscription plan.",
}

export default async function BillingPage() {
  await checkAuth();
  const subscriptionPlan = await getUserSubscriptionPlan();
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>This app is in test mode</AlertTitle>
          <AlertDescription>
            Snack app is using a Stripe test environment. You can
            find a list of test card numbers on the{" "}
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a>
            .
          </AlertDescription>
        </Alert>
        <BillingInfo
          subscriptionPlan={subscriptionPlan}
        />
      </div>
    </DashboardShell>
  )
}
