"use server"

import { createSafeAction } from "@/lib/create-safe-action"
import { auth } from "@clerk/nextjs"
import { DeleteList } from "./schema"
import { InputType, ReturnType } from "./types"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data;
  let list;

  try {
    list = await prisma.list.delete({
      where: {
        id,
      },
    });

    await createAuditLog({
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.DELETE,
    })
  } catch (error) {
    return {
      error: "Failed to delete."
    }
  }

  revalidatePath(`/lists`);
  redirect(`/lists`);
}
export const deleteList = createSafeAction(DeleteList, handler);