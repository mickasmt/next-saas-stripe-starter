import * as React from "react"

export function useMounted() {
  // useSyncExternalStore's getServerSnapshot is only ever called during SSR
  // (false) and getSnapshot only on the client after hydration (true) - the
  // standard isomorphic replacement for a setState-in-effect mounted flag.
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}
