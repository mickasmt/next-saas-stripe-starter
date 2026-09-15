import { SignOutButton } from "@/components/auth/sign-out-button"
import { getActiveOrganization } from "@/lib/auth/session"

// Temporary page to validate the auth flow until the dashboard layout lands.
export default async function DashboardPage() {
  const { session, organization, member } = await getActiveOrganization()

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold tracking-tight">
        Hi, {session.user.name}
      </h1>
      <p className="text-muted-foreground">
        {organization.name} · {member.role}
      </p>
      <SignOutButton />
    </main>
  )
}
