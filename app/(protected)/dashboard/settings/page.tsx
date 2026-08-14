import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = constructMetadata({
  title: "Settings – SaaS Starter",
  description: "Configure your account and website settings.",
});

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="font-medium">Name:</span> {user.name || "Not set"}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p className="text-muted-foreground">Profile editing will be exposed through the versioned LMS API.</p>
        </CardContent>
      </Card>
    </>
  );
}
