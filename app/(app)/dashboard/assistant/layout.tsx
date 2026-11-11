import { requireFeature } from "@/lib/features/guard"

export default async function AssistantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireFeature("assistant")
  return children
}
