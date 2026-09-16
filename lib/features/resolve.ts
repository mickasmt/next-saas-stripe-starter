import "server-only"

import { cookies } from "next/headers"
import { cache } from "react"

import {
  featureKeys,
  features,
  isFeatureKey,
  type FeatureKey,
} from "@/config/features"
import {
  foundation,
  foundationKeys,
  type FoundationKey,
} from "@/config/foundation"

export const FEATURE_OVERRIDES_COOKIE = "dev-feature-overrides"

export type FeatureSource = "default" | "env" | "override"

// disabled: switched off. blocked: a dependency is off. unconfigured: a
// required service misses env vars. ready: on and usable.
export type FeatureStatus = "disabled" | "blocked" | "unconfigured" | "ready"

export type FeatureState = {
  key: FeatureKey
  enabled: boolean
  status: FeatureStatus
  // Where the flag's own value comes from, before dependencies are applied.
  source: FeatureSource
  // The flag's own value once its dev override is removed (env or default).
  inherited: boolean
  // The variable that overrides the default, e.g. FEATURE_BILLING.
  envName: string
  // Dependencies currently switched off, forcing this flag off.
  blockedBy: FeatureKey[]
  // Env vars of required services that are not set.
  missingEnv: string[]
}

export type FoundationState = {
  key: FoundationKey
  configured: boolean
  missingEnv: string[]
}

export type FeatureOverrides = Partial<Record<FeatureKey, boolean>>

export function getFoundationStates(): FoundationState[] {
  return foundationKeys.map((key) => {
    const missingEnv = foundation[key].requiredEnv.filter(
      (name) => !process.env[name]
    )
    return { key, configured: missingEnv.length === 0, missingEnv }
  })
}

// Resolution order: config default < FEATURE_* env var < dev override cookie.
// A flag is enabled only if its own value is on, its dependencies are enabled
// and its required services are configured.
export const getFeatureStates = cache(async () => {
  const foundationStates = new Map(
    getFoundationStates().map((state) => [state.key, state])
  )
  const missingEnvOf = (key: FeatureKey) =>
    (features[key].requires ?? []).flatMap(
      (service) => foundationStates.get(service)?.missingEnv ?? []
    )

  const overrides = await getDevOverrides()

  const own = Object.fromEntries(
    featureKeys.map((key) => {
      const env = parseBoolean(process.env[toEnvName(key)])
      const inherited = env ?? features[key].default
      if (overrides[key] !== undefined) {
        return [key, { value: overrides[key], source: "override", inherited }]
      }
      const source = env !== undefined ? "env" : "default"
      return [key, { value: inherited, source, inherited }]
    })
  ) as Record<
    FeatureKey,
    { value: boolean; source: FeatureSource; inherited: boolean }
  >

  const resolved = new Map<FeatureKey, boolean>()

  function isEnabled(key: FeatureKey, path: FeatureKey[] = []): boolean {
    const known = resolved.get(key)
    if (known !== undefined) return known
    if (path.includes(key)) {
      throw new Error(
        `Circular feature dependency: ${[...path, key].join(" -> ")}`
      )
    }

    const deps = features[key].dependsOn ?? []
    const enabled =
      own[key].value &&
      missingEnvOf(key).length === 0 &&
      deps.every((dep) => isEnabled(dep, [...path, key]))
    resolved.set(key, enabled)
    return enabled
  }

  return featureKeys.map((key): FeatureState => {
    const deps = features[key].dependsOn ?? []
    const blockedBy = deps.filter((dep) => !isEnabled(dep))
    const missingEnv = [...new Set(missingEnvOf(key))]

    let status: FeatureStatus = "ready"
    if (!own[key].value) status = "disabled"
    else if (blockedBy.length > 0) status = "blocked"
    else if (missingEnv.length > 0) status = "unconfigured"

    return {
      key,
      enabled: isEnabled(key),
      status,
      source: own[key].source,
      inherited: own[key].inherited,
      envName: toEnvName(key),
      blockedBy,
      missingEnv,
    }
  })
})

export async function getFeatures() {
  const states = await getFeatureStates()
  return Object.fromEntries(
    states.map((state) => [state.key, state.enabled])
  ) as Record<FeatureKey, boolean>
}

export async function isFeatureEnabled(key: FeatureKey) {
  return (await getFeatures())[key]
}

export async function getDevOverrides(): Promise<FeatureOverrides> {
  // Checked before cookies() so production pages are never made dynamic
  // and overrides can't be injected by a visitor.
  if (process.env.NODE_ENV !== "development") return {}

  const raw = (await cookies()).get(FEATURE_OVERRIDES_COOKIE)?.value
  if (!raw) return {}

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return {}
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([key, value]) => isFeatureKey(key) && typeof value === "boolean"
      )
    )
  } catch {
    return {}
  }
}

function toEnvName(key: FeatureKey) {
  return `FEATURE_${key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase()}`
}

function parseBoolean(value: string | undefined) {
  if (value === "true" || value === "1") return true
  if (value === "false" || value === "0") return false
  return undefined
}
