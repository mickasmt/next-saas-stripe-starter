import { notFound } from "next/navigation"

import { requireSession } from "@/lib/auth/session"
import { requireFeature } from "@/lib/features/guard"
import { canViewAdmin } from "@/modules/admin/preview"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireFeature("admin")
  const session = await requireSession()
  if (!(await canViewAdmin(session))) notFound()
  return children
}
