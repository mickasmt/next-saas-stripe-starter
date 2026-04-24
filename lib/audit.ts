import { prisma } from "@/lib/db";

export async function logAuditEvent({
  teamId,
  userId,
  action,
  target,
  metadata,
}: {
  teamId: string;
  userId: string;
  action: string;
  target?: string;
  metadata?: Record<string, unknown>;
}) {
  await prisma.auditLog.create({
    data: {
      teamId,
      userId,
      action,
      target,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
    },
  });
}
