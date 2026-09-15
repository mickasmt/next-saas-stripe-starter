import { stripeClient } from "@better-auth/stripe/client"
import { adminClient, organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    organizationClient({ teams: { enabled: true } }),
    stripeClient({ subscription: true }),
  ],
})
