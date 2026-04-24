import { redirect } from "next/navigation";

import { getCurrentUser, getCurrentTeam } from "@/lib/session";
import { getTeamSubscriptionPlan } from "@/lib/team-subscription";
import { hasPermission } from "@/lib/auth/permissions";
import { constructMetadata } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/pricing/billing-info";
import { Icons } from "@/components/shared/icons";

export const metadata = constructMetadata({
  title: "Team Billing – SaaS Starter",
  description: "Manage team billing and subscription plan.",
});

export default async function TeamBillingPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const teamData = await getCurrentTeam();
  if (!teamData) redirect("/dashboard/team");

  if (!hasPermission(teamData.membership.role, "team:billing:manage")) {
    redirect("/dashboard/team");
  }

  const subscriptionPlan = await getTeamSubscriptionPlan(teamData.team.id);

  return (
    <>
      <DashboardHeader
        heading="Team Billing"
        text="Manage team billing and subscription plan."
      />
      <div className="grid gap-8">
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription className="text-balance">
            SaaS Starter app is a demo app using a Stripe test environment. You
            can find a list of test card numbers on the{" "}
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
        <BillingInfo userSubscriptionPlan={subscriptionPlan} />
      </div>
    </>
  );
}
