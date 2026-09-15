import type { FeatureKey } from "@/config/features"
import type { NavSection } from "@/config/nav"

export function filterNav(
  sections: NavSection[],
  {
    features,
    role,
  }: { features: Record<FeatureKey, boolean>; role?: string | null }
) {
  const roles = role?.split(",").map((r) => r.trim()) ?? []

  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          (!item.authorizeOnly || roles.includes(item.authorizeOnly)) &&
          (!item.feature || features[item.feature])
      ),
    }))
    .filter((section) => section.items.length > 0)
}
