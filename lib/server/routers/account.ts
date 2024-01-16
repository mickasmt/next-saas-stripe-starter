import { getUserAuth } from "@/lib/auth";
import { publicProcedure, router } from "@/lib/server/trpc";
import { getUserSubscriptionPlan } from "@/lib/stripe/subscription";
export const accountRouter = router({
  getUser: publicProcedure.query(async () => {
    const { session } = await getUserAuth();
    return session;
  }),
  getSubscription: publicProcedure.query(async () => {
    const sub = await getUserSubscriptionPlan();
    return sub;
  }),
});
