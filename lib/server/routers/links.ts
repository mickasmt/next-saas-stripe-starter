import { getLinkById, getLinks } from "@/lib/api/links/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  linkIdSchema,
  insertLinkParams,
  updateLinkParams,
} from "@/lib/db/schema/links";
import { urlSchema } from "@/lib/validations/og";

import { createLink, deleteLink, updateLink } from "@/lib/api/links/mutations";
import { fetchOGData } from "@/lib/api/links/helpers"

export const linksRouter = router({
  getLinks: publicProcedure.query(async () => {
    return getLinks();
  }),
  getLinkById: publicProcedure.input(linkIdSchema).query(async ({ input }) => {
    return getLinkById(input.id);
  }),
  createLink: publicProcedure
    .input(insertLinkParams)
    .mutation(async ({ input }) => {
      return createLink(input);
    }),
  updateLink: publicProcedure
    .input(updateLinkParams)
    .mutation(async ({ input }) => {
      return updateLink(input.id, input);
    }),
  deleteLink: publicProcedure
    .input(linkIdSchema)
    .mutation(async ({ input }) => {
      return deleteLink(input.id);
    }),
  getLinkOgData: publicProcedure
    .input(urlSchema)
    .query(async ({ input }) => {
      return fetchOGData(input.url);
    }),
});
