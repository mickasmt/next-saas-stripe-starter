// No `import "server-only"` here: the Better Auth CLI loads this file to
// generate the schema and cannot resolve it. Server-only guards live in
// lib/auth/session.ts and lib/db consumers instead.
import { stripe } from "@better-auth/stripe"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { admin, oneTap, organization } from "better-auth/plugins"
import { eq } from "drizzle-orm"
import { revalidateTag } from "next/cache"

import { prepareAccountDeletion } from "@/lib/auth/delete-account"
import { isOrganizationManager, isPlatformAdmin } from "@/lib/auth/roles"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { stripeClient } from "@/lib/stripe"
import { plans } from "@/modules/billing/plans"
import { PRICES_CACHE_TAG } from "@/modules/billing/prices-tag"

// Better Auth validates its config as soon as this file is imported, and
// rejects in production without a secret, even with the auth module off. The
// module stays off until both variables are set (see config/foundation.ts),
// so these placeholders never sign or redirect anything.
const secret =
  process.env.BETTER_AUTH_SECRET || crypto.randomUUID() + crypto.randomUUID()
const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000"

export const auth = betterAuth({
  secret,
  baseURL,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: (user) => prepareAccountDeletion(user.id),
    },
  },
  socialProviders: {
    // Callback URL: {BETTER_AUTH_URL}/api/auth/callback/google
    google: {
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID),
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      prompt: "select_account",
      // Better Auth only copies the provider profile when it creates the user,
      // so an account that signed up with a password and linked Google later
      // never gets an avatar, and a Google picture URL that rotated stays
      // stored as a dead link. Re-applying the profile on every sign-in fixes
      // both; the mapping below keeps Google a *default* only.
      overrideUserInfoOnSignIn: true,
      mapProfileToUser: async (profile) => {
        const [existing] = await db
          .select({ name: schema.user.name, image: schema.user.image })
          .from(schema.user)
          .where(eq(schema.user.email, profile.email.toLowerCase()))
          .limit(1)

        if (!existing) return {}

        // An avatar the user uploaded themselves wins; one Google gave us is
        // the provider's to refresh, so a rotated URL heals on the next login.
        const stored = existing.image ?? undefined
        const custom = stored !== undefined && !isProviderAvatar(stored)

        // `undefined` leaves the stored column untouched.
        return {
          name: existing.name || profile.name,
          image: custom ? stored : profile.picture,
        }
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Every account gets an organization from day one. Solo mode is only
        // a UI concern (the `multiTenant` flag), never a data shape.
        after: async (user, ctx) => {
          const name = user.name || user.email.split("@")[0]
          const organization = await auth.api.createOrganization({
            body: { name, slug: createSlug(name), userId: user.id },
          })

          // This hook runs after sign-up has already created the session, so
          // the session hook below found no membership yet: backfill it.
          if (organization && ctx) {
            await ctx.context.adapter.updateMany({
              model: "session",
              where: [{ field: "userId", value: user.id }],
              update: { activeOrganizationId: organization.id },
            })
          }
        },
      },
    },
    session: {
      create: {
        // Restore an active organization on every new session. Picks the
        // oldest membership; the org switcher changes it afterwards.
        before: async (session, ctx) => {
          if (!ctx) return { data: session }

          const [membership] = await ctx.context.adapter.findMany<{
            organizationId: string
          }>({
            model: "member",
            where: [{ field: "userId", value: session.userId }],
            sortBy: { field: "createdAt", direction: "asc" },
            limit: 1,
          })

          return {
            data: {
              ...session,
              activeOrganizationId: membership?.organizationId ?? null,
            },
          }
        },
      },
    },
  },

  plugins: [
    admin(),
    // Reuses the Google client ID above; only the prompt lives client-side.
    oneTap(),
    organization({
      teams: { enabled: true },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
      // Price or product edited in Stripe: drop the cached prices right away.
      onEvent: async (event) => {
        if (
          event.type.startsWith("price.") ||
          event.type.startsWith("product.")
        ) {
          revalidateTag(PRICES_CACHE_TAG, "max")
        }
      },
      organization: { enabled: true },
      subscription: {
        enabled: true,
        plans,
        // Subscriptions belong to organizations: only owners/admins may manage
        // billing, any member may read it.
        authorizeReference: async ({ user, referenceId, action }, ctx) => {
          const member = await ctx.context.adapter.findOne<{ role: string }>({
            model: "member",
            where: [
              { field: "organizationId", value: referenceId },
              { field: "userId", value: user.id },
            ],
          })

          if (!member) return false
          if (action === "list-subscription") return true
          // Platform admins already have the top plan: no checkout for them.
          if (action === "upgrade-subscription" && isPlatformAdmin(user.role)) {
            return false
          }

          return isOrganizationManager(member.role)
        },
      },
    }),
    // Must stay last: lets server actions set auth cookies.
    nextCookies(),
  ],
})

// Avatars served by a social provider rather than uploaded by the user. These
// URLs are disposable: the provider rotates them whenever the photo changes.
function isProviderAvatar(url: string) {
  try {
    return new URL(url).hostname.endsWith(".googleusercontent.com")
  } catch {
    return false
  }
}

export type Session = typeof auth.$Infer.Session

function createSlug(name: string) {
  const base = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32)

  return `${base || "workspace"}-${crypto.randomUUID().slice(0, 6)}`
}
