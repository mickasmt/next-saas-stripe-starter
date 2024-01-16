"use server";

import { revalidatePath } from "next/cache";
import {
  createList,
  deleteList,
  updateList,
} from "@/lib/api/lists/mutations";
import {
  ListId,
  NewListParams,
  UpdateListParams,
  listIdSchema,
  insertListParams,
  updateListParams,
} from "@/lib/db/schema/lists";

const handleErrors = (e: unknown) => {
  if (e instanceof Error) return e.message;
  if (e && typeof e === "object" && "error" in e) return e.error as string;
  return "Error";
};

const revalidateLists = () => revalidatePath("/lists");

export const createListAction = async (input: NewListParams) => {
  try {
    const payload = insertListParams.parse(input);
    await createList(payload);
    revalidateLists();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateListAction = async (input: UpdateListParams) => {
  try {
    const payload = updateListParams.parse(input);
    await updateList(payload.id, payload);
    revalidateLists();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteListAction = async (input: ListId) => {
  try {
    const payload = listIdSchema.parse({ id: input });
    await deleteList(payload.id);
    revalidateLists();
  } catch (e) {
    return handleErrors(e);
  }
};