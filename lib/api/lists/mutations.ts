import { db } from "@/lib/db/index";
import { 
  ListId, 
  NewListParams,
  UpdateListParams, 
  updateListSchema,
  insertListSchema, 
  listIdSchema 
} from "@/lib/db/schema/lists";
import { getUserAuth } from "@/lib/auth";

export const createList = async (list: NewListParams) => {
  const { session } = await getUserAuth();
  const newList = insertListSchema.parse({ ...list, userId: session?.user.id! });
  try {
    const l = await db.list.create({ data: newList });
    return { list: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateList = async (id: ListId, list: UpdateListParams) => {
  const { session } = await getUserAuth();
  const { id: listId } = listIdSchema.parse({ id });
  const newList = updateListSchema.parse({ ...list, userId: session?.user.id! });
  try {
    const l = await db.list.update({ where: { id: listId, userId: session?.user.id! }, data: newList})
    return { list: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteList = async (id: ListId) => {
  const { session } = await getUserAuth();
  const { id: listId } = listIdSchema.parse({ id });


  console.log("listId", listId);
  try {
    const l = await db.list.delete({ where: { id: listId, userId: session?.user.id! }})
    return { list: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

