import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function logAuditEvent(
  teamId: string,
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, unknown>,
) {
  await prisma.auditLog.create({
    data: {
      teamId,
      actorId,
      action,
      targetType,
      targetId,
      metadata: (metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    },
  });
}
