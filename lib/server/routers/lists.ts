import {
  getListById,
  getLists,
  getListByIdWithLinks,
} from "@/lib/api/lists/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  listIdSchema,
  insertListParams,
  updateListParams,
} from "@/lib/db/schema/lists";
import { createList, deleteList, updateList } from "@/lib/api/lists/mutations";

export const listsRouter = router({
  getLists: publicProcedure.query(async () => {
    return getLists();
  }),
  getListById: publicProcedure.input(listIdSchema).query(async ({ input }) => {
    return getListById(input.id);
  }),
  getListByIdWithLinks: publicProcedure
    .input(listIdSchema)
    .query(async ({ input }) => {
    return getListByIdWithLinks(input.id);
  }),
  createList: publicProcedure
    .input(insertListParams)
    .mutation(async ({ input }) => {
      return createList(input);
    }),
  updateList: publicProcedure
    .input(updateListParams)
    .mutation(async ({ input }) => {
      return updateList(input.id, input);
    }),
  deleteList: publicProcedure
    .input(listIdSchema)
    .mutation(async ({ input }) => {
      return deleteList(input.id);
    }),
});
