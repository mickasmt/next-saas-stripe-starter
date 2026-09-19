import { stripeClient } from "@better-auth/stripe/client"
import {
  adminClient,
  oneTapClient,
  organizationClient,
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

// Google Identity Services reads the client ID in the browser, so this one has
// to be public. The secret stays server-side.
export const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    oneTapClient({ clientId: googleClientId, autoSelect: false }),
    organizationClient({ teams: { enabled: true } }),
    stripeClient({ subscription: true }),
  ],
})
