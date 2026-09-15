import { requireRole } from "@/lib/auth/session"
import { requireFeature } from "@/lib/features/guard"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireFeature("admin")
  await requireRole("admin")
  return children
}
