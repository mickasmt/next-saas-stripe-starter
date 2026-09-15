import "server-only"

import { notFound } from "next/navigation"

import type { FeatureKey } from "@/config/features"
import { isFeatureEnabled } from "@/lib/features/resolve"

// Call once in the parent layout of a module: the single gate for its routes.
export async function requireFeature(key: FeatureKey) {
  if (!(await isFeatureEnabled(key))) notFound()
}

// Layouts don't protect server actions or route handlers: call this at the
// top of every action that belongs to a flagged module.
export async function assertFeature(key: FeatureKey) {
  if (!(await isFeatureEnabled(key))) {
    throw new Error(`Feature "${key}" is disabled`)
  }
}
