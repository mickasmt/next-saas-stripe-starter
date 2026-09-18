import type { FeatureKey } from "@/config/features"
import type { NavPanel, NavSection } from "@/config/nav"

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

// Drops panels whose every item was filtered out.
export function filterPanels(
  panels: NavPanel[],
  options: { features: Record<FeatureKey, boolean>; role?: string | null }
) {
  return panels
    .map((panel) => ({
      ...panel,
      sections: filterNav(panel.sections, options),
    }))
    .filter((panel) => panel.sections.length > 0)
}

// The panel owning this route, longest prefix first.
export function getActivePanel(pathname: string, panels: NavPanel[]) {
  return panels
    .filter((panel) => pathname.startsWith(panel.prefix))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0]
}
