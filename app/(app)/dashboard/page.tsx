import Link from "next/link"

import { SignOutButton } from "@/components/auth/sign-out-button"
import { dashboardNav } from "@/config/nav"
import { getActiveOrganization } from "@/lib/auth/session"
import { getFeatures } from "@/lib/features/resolve"
import { filterNav } from "@/lib/nav"

// Temporary page to validate auth and feature flags until the dashboard layout lands.
export default async function DashboardPage() {
  const { session, organization, member } = await getActiveOrganization()
  const nav = filterNav(dashboardNav, {
    features: await getFeatures(),
    role: session.user.role,
  })

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold tracking-tight">
        Hi, {session.user.name}
      </h1>
      <p className="text-muted-foreground">
        {organization.name} · {member.role}
      </p>
      <nav className="grid gap-1">
        {nav.flatMap((section) =>
          section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm hover:bg-muted"
            >
              {item.title}
            </Link>
          ))
        )}
      </nav>
      <SignOutButton />
    </main>
  )
}
