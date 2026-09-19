"use client"

import { useEffect } from "react"

import { authClient, googleClientId } from "@/lib/auth/client"
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/redirect"

// Once per page load, not per mount: a second prompt aborts the pending FedCM
// request, which is what Fast Refresh and a marketing → /login trip would do.
let prompted = false

// The plugin loads Google Identity Services but keeps its window type private.
type GoogleIdentity = { accounts: { id: { cancel: () => void } } }

// Google's own prompt, shown to signed-out visitors. On success the plugin
// navigates to `callbackURL` itself, so the new session is always picked up.
export function GoogleOneTap({
  redirectTo = DEFAULT_LOGIN_REDIRECT,
}: {
  redirectTo?: string
}) {
  useEffect(() => {
    if (prompted || !googleClientId) return
    prompted = true

    // Dismissing the prompt is a normal outcome, never an error to surface.
    authClient.oneTap({ callbackURL: redirectTo }).catch(() => {})

    // Close it on the way out rather than leaving it over the next page.
    // `cancel()` is programmatic, so it doesn't count as a user dismissal.
    return () => {
      const google = (window as { google?: GoogleIdentity }).google
      google?.accounts.id.cancel()
    }
  }, [redirectTo])

  return null
}
