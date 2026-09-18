import type { FeatureSource, FeatureStatus } from "@/lib/features/resolve"

// Client-side mirror of lib/features/resolve.ts. The panel resolves modules
// itself so a switch reacts instantly and a change can be previewed (what it
// turns on, what it pauses) before it is applied.

export type PanelModule = {
  key: string
  label: string
  description: string
  default: boolean
  inherited: boolean
  source: FeatureSource
  envName: string
  dependsOn: string[]
  requires: string[]
}

export type PanelService = {
  key: string
  label: string
  providerLabel: string
  setupUrl: string
  missingEnv: string[]
}

export type OwnValues = Record<string, boolean>

// `null` removes the override.
export type OverridePatch = Record<string, boolean | null>

export type ResolvedModule = {
  enabled: boolean
  status: FeatureStatus
  blockedBy: string[]
  // Required services that miss env vars.
  unconfigured: string[]
}

export function resolveModules(
  modules: PanelModule[],
  services: PanelService[],
  own: OwnValues
) {
  const byKey = new Map(modules.map((mod) => [mod.key, mod]))
  const missing = new Set(
    services
      .filter((service) => service.missingEnv.length > 0)
      .map((service) => service.key)
  )
  const enabled = new Map<string, boolean>()

  function isEnabled(key: string, path: string[] = []): boolean {
    const known = enabled.get(key)
    if (known !== undefined) return known
    const mod = byKey.get(key)
    if (!mod || path.includes(key)) return false

    const value =
      own[key] &&
      mod.requires.every((service) => !missing.has(service)) &&
      mod.dependsOn.every((dep) => isEnabled(dep, [...path, key]))
    enabled.set(key, value)
    return value
  }

  return new Map(
    modules.map((mod): [string, ResolvedModule] => {
      const blockedBy = mod.dependsOn.filter((dep) => !isEnabled(dep))
      const unconfigured = mod.requires.filter((s) => missing.has(s))

      let status: FeatureStatus = "ready"
      if (!own[mod.key]) status = "disabled"
      else if (blockedBy.length > 0) status = "blocked"
      else if (unconfigured.length > 0) status = "unconfigured"

      return [
        mod.key,
        { enabled: isEnabled(mod.key), status, blockedBy, unconfigured },
      ]
    })
  )
}

export type Change = {
  patch: OverridePatch
  // Other modules this change switches on or off.
  turnsOn: string[]
  turnsOff: string[]
  // False when the target can't reach the requested state (a service it or
  // one of its dependencies needs is not configured).
  possible: boolean
}

// Plans switching `key` on or off. Turning a module on also turns on every
// dependency that is off; turning it off pauses the modules built on it.
export function planChange(
  modules: PanelModule[],
  services: PanelService[],
  own: OwnValues,
  key: string,
  on: boolean
): Change {
  const byKey = new Map(modules.map((mod) => [mod.key, mod]))
  const next: OwnValues = { ...own, [key]: on }

  if (on) {
    const visit = (k: string) => {
      for (const dep of byKey.get(k)?.dependsOn ?? []) {
        next[dep] = true
        visit(dep)
      }
    }
    visit(key)
  }

  const before = resolveModules(modules, services, own)
  const after = resolveModules(modules, services, next)

  const patch: OverridePatch = {}
  for (const mod of modules) {
    if (next[mod.key] === own[mod.key]) continue
    // An override equal to the inherited value is dropped, so the change
    // count only reflects real departures from env/defaults.
    patch[mod.key] = next[mod.key] === mod.inherited ? null : next[mod.key]
  }

  const others = modules.filter((mod) => mod.key !== key)
  return {
    patch,
    turnsOn: others
      .filter((m) => !before.get(m.key)!.enabled && after.get(m.key)!.enabled)
      .map((m) => m.key),
    turnsOff: others
      .filter((m) => before.get(m.key)!.enabled && !after.get(m.key)!.enabled)
      .map((m) => m.key),
    possible: after.get(key)!.enabled === on,
  }
}

export function applyPatch(
  modules: PanelModule[],
  own: OwnValues,
  patch: OverridePatch | "reset"
): OwnValues {
  if (patch === "reset") {
    return Object.fromEntries(modules.map((m) => [m.key, m.inherited]))
  }
  const next = { ...own }
  for (const mod of modules) {
    if (!(mod.key in patch)) continue
    next[mod.key] = patch[mod.key] ?? mod.inherited
  }
  return next
}

// FEATURE_* lines that reproduce the current setup in another environment.
export function toEnvLines(modules: PanelModule[], own: OwnValues) {
  return modules
    .filter((mod) => own[mod.key] !== mod.default)
    .map((mod) => `${mod.envName}=${own[mod.key]}`)
}
