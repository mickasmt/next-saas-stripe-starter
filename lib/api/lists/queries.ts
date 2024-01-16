import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth";
import { type ListId, listIdSchema } from "@/lib/db/schema/lists";

export const getLists = async () => {
  const { session } = await getUserAuth();
  const l = await db.list.findMany({ where: {userId: session?.user.id!}});
  return { lists: l };
};

export const getListById = async (id: ListId) => {
  const { session } = await getUserAuth();
  const { id: listId } = listIdSchema.parse({ id });
  const l = await db.list.findFirst({
    where: { id: listId, userId: session?.user.id!}});
  return { lists: l };
};

export const getListByIdWithLinks = async (id: ListId) => {
  const { session } = await getUserAuth();
  const l = await db.list.findFirst({
    where: { id: id, userId: session?.user.id!},
    include: { links: true }
  });
  return { list: l };
}


