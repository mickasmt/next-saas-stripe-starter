// Same codebase, two deployments: the free starter and the Pro demo. Set
// NEXT_PUBLIC_APP_MODE=pro on the Pro deployment's env vars only.
export type AppMode = "free" | "pro"

export function getAppMode(): AppMode {
  return process.env.NEXT_PUBLIC_APP_MODE === "pro" ? "pro" : "free"
}
