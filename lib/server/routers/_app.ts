import { router } from "@/lib/server/trpc";
import { accountRouter } from "./account";
import { listsRouter } from "./lists";
import { linksRouter } from "./links";

export const appRouter = router({
  account: accountRouter,
  lists: listsRouter,
  listlinks: linksRouter,
});

export type AppRouter = typeof appRouter;
