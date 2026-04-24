import "server-only";

import { prisma } from "@/lib/db";

type AuditAction =
  | "team.created"
  | "team.updated"
  | "team.deleted"
  | "member.invited"
  | "member.removed"
  | "member.role_changed"
  | "member.joined"
  | "member.left"
  | "invite.revoked";

export async function logAudit({
  teamId,
  userId,
  action,
  targetId,
  metadata,
}: {
  teamId: string;
  userId: string;
  action: AuditAction;
  targetId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        teamId,
        userId,
        action,
        targetId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });
  } catch {
    // Don't fail the parent operation if audit logging fails
    console.error("Failed to write audit log", { teamId, action });
  }
}
