import { db } from "@/lib/db/index";
import { 
  LinkId, 
  NewLinkParams,
  UpdateLinkParams, 
  updateLinkSchema,
  insertLinkSchema, 
  linkIdSchema 
} from "@/lib/db/schema/links";
import { getUserAuth } from "@/lib/auth";

export const createLink = async (link: NewLinkParams) => {
  const { session } = await getUserAuth();
  const newLink = insertLinkSchema.parse({ ...link, userId: session?.user.id! });
  try {
    const l = await db.link.create({ data: newLink });
    return { link: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateLink = async (id: LinkId, link: UpdateLinkParams) => {
  const { session } = await getUserAuth();
  const { id: linkId } = linkIdSchema.parse({ id });
  const newLink = updateLinkSchema.parse({ ...link, userId: session?.user.id! });
  try {
    const l = await db.link.update({ where: { id: linkId, userId: session?.user.id! }, data: newLink})
    return { link: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteLink = async (id: LinkId) => {
  const { session } = await getUserAuth();
  const { id: linkId } = linkIdSchema.parse({ id });
  try {
    const l = await db.link.delete({ where: { id: linkId, userId: session?.user.id! }})
    return { link: l };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

