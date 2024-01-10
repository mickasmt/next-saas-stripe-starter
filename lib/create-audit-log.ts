import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { prisma } from "@/lib/db";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE,
  action: ACTION;
};

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!user || !orgId) {
      throw new Error("User not found!");
    }

    const { entityId, entityType, action } = props;

    await prisma.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        action,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: user?.firstName + " " + user?.lastName,
      }
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
}