import { DashboardShell } from "@/components/dashboard/shell"
import UserSettings from "@/components/account/UserSettings";
import { checkAuth, getUserAuth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/header"

export default async function SettingsPage() {
  await checkAuth();
  const { session } = await getUserAuth();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Settings for your account."
      />
      <UserSettings session={session} />
    </DashboardShell>
  );
}
