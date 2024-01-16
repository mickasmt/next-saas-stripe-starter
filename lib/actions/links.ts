"use server";

import { revalidatePath } from "next/cache";
import {
  createLink,
  deleteLink,
  updateLink,
} from "@/lib/api/links/mutations";
import {
  LinkId,
  NewLinkParams,
  UpdateLinkParams,
  linkIdSchema,
  insertLinkParams,
  updateLinkParams,
} from "@/lib/db/schema/links";

const handleErrors = (e: unknown) => {
  if (e instanceof Error) return e.message;
  if (e && typeof e === "object" && "error" in e) return e.error as string;
  return "Error";
};

const revalidateLinks = () => revalidatePath("/links");

export const createLinkAction = async (input: NewLinkParams) => {
  try {
    const payload = insertLinkParams.parse(input);
    await createLink(payload);
    revalidateLinks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateLinkAction = async (input: UpdateLinkParams) => {
  try {
    const payload = updateLinkParams.parse(input);
    await updateLink(payload.id, payload);
    revalidateLinks();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteLinkAction = async (input: LinkId) => {
  try {
    const payload = linkIdSchema.parse({ id: input });
    await deleteLink(payload.id);
    revalidateLinks();
  } catch (e) {
    return handleErrors(e);
  }
};