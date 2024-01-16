import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth";
import { type LinkId, linkIdSchema } from "@/lib/db/schema/links";

export const getLinks = async () => {
  const { session } = await getUserAuth();
  const l = await db.link.findMany({ where: {userId: session?.user.id!}, include: { list: true}});
  return { links: l };
};

export const getLinkById = async (id: LinkId) => {
  const { session } = await getUserAuth();
  const { id: linkId } = linkIdSchema.parse({ id });
  const l = await db.link.findFirst({
    where: { id: linkId, userId: session?.user.id!},
    include: { list: true }
  });
  return { links: l };
};

