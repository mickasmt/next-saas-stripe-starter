import { ModulesPanel } from "@/components/dev/modules-panel"
import { features } from "@/config/features"
import { foundation } from "@/config/foundation"
import { getFeatureStates, getFoundationStates } from "@/lib/features/resolve"

export async function DevToolbar() {
  if (process.env.NODE_ENV !== "development") return null

  const states = await getFeatureStates()

  return (
    <ModulesPanel
      modules={states.map((state) => ({
        key: state.key,
        label: features[state.key].label,
        description: features[state.key].description,
        default: features[state.key].default,
        dependsOn: [...(features[state.key].dependsOn ?? [])],
        requires: [...(features[state.key].requires ?? [])],
      }))}
      services={getFoundationStates().map((state) => ({
        key: state.key,
        label: foundation[state.key].label,
        providerLabel: foundation[state.key].providerLabel,
        setupUrl: foundation[state.key].setupUrl,
        missingEnv: state.missingEnv,
      }))}
      own={Object.fromEntries(
        states.map((state) => [state.key, state.status !== "disabled"])
      )}
    />
  )
}
