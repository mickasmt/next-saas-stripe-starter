import { requireFeature } from "@/lib/features/guard"

export default async function BillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireFeature("billing")
  return children
}
