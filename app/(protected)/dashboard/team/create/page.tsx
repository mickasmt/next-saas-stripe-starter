import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { CreateTeamForm } from "@/components/forms/create-team-form";

export const metadata = constructMetadata({
  title: "Create Team – SaaS Starter",
  description: "Create a new team.",
});

export default async function CreateTeamPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Create Team"
        text="Create a new team to collaborate with others."
      />
      <div className="max-w-lg">
        <CreateTeamForm />
      </div>
    </>
  );
}
