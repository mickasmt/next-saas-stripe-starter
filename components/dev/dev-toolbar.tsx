import { FeatureFlagsPanel } from "@/components/dev/feature-flags-panel"
import { features } from "@/config/features"
import { getFeatureStates } from "@/lib/features/resolve"

export async function DevToolbar() {
  if (process.env.NODE_ENV !== "development") return null

  const states = await getFeatureStates()

  return (
    <FeatureFlagsPanel
      flags={states.map((state) => ({
        ...state,
        label: features[state.key].label,
        description: features[state.key].description,
        blockedBy: state.blockedBy.map((key) => features[key].label),
      }))}
    />
  )
}
