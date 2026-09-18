import { APIError } from "better-auth/api"
import { and, count, eq, inArray, isNull, ne, notInArray } from "drizzle-orm"

import { db } from "@/lib/db"
import { member, organization, subscription } from "@/lib/db/schema"

const ENDED_STATUSES = ["canceled", "incomplete", "incomplete_expired"]

function isOwner(role: string) {
  return role.split(",").some((r) => r.trim() === "owner")
}

// Runs before users delete their own account. Organizations they are alone in
// are deleted with them; shared ones keep running without them.
export async function prepareAccountDeletion(userId: string) {
  const memberships = await db
    .select({
      organizationId: member.organizationId,
      name: organization.name,
      role: member.role,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(eq(member.userId, userId))

  const soloOrganizationIds: string[] = []

  for (const membership of memberships) {
    const others = await db
      .select({ role: member.role })
      .from(member)
      .where(
        and(
          eq(member.organizationId, membership.organizationId),
          ne(member.userId, userId)
        )
      )

    if (others.length === 0) {
      soloOrganizationIds.push(membership.organizationId)
    } else if (
      isOwner(membership.role) &&
      !others.some((other) => isOwner(other.role))
    ) {
      throw new APIError("BAD_REQUEST", {
        message: `Make another member owner of ${membership.name} first.`,
      })
    }
  }

  if (soloOrganizationIds.length === 0) return

  // Same rule as deleting an organization: cancel a running subscription first.
  // A subscription set to end is fine: the portal sets cancelAt, and only some
  // of Stripe's cancellations also set cancelAtPeriodEnd.
  const [{ running }] = await db
    .select({ running: count() })
    .from(subscription)
    .where(
      and(
        inArray(subscription.referenceId, soloOrganizationIds),
        notInArray(subscription.status, ENDED_STATUSES),
        eq(subscription.cancelAtPeriodEnd, false),
        isNull(subscription.cancelAt)
      )
    )

  if (running > 0) {
    throw new APIError("BAD_REQUEST", {
      message:
        "Cancel your subscription in Billing before deleting your account.",
    })
  }

  // referenceId has no foreign key, so these rows outlive their organization.
  await db
    .delete(subscription)
    .where(inArray(subscription.referenceId, soloOrganizationIds))

  await db
    .delete(organization)
    .where(inArray(organization.id, soloOrganizationIds))
}
