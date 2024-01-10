'use server'

import { auth } from "@clerk/nextjs"
import { prisma } from '@/lib/db'
import { InputType, ReturnType } from "./types"
import { createSafeAction } from "@/lib/create-safe-action"
import { CreateList } from "./schema"
import { revalidatePath } from "next/cache"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { createAuditLog } from "@/lib/create-audit-log"

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId } = auth();

	if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

	let list;

	try {
    list = await prisma.list.create({
			data: {
				userId,
			}
		});

    await createAuditLog({
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    })

    console.log('success')
  } catch (error) {

    console.log('errrrrrrrror')
    console.log({error});
    return {
      error: "Failed to create."
    }
  }

  revalidatePath(`/${list.id}`);
  return { data: list };
}

export const createList = createSafeAction(CreateList, handler);