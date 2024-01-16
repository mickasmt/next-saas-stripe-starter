import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { NextRequest } from "next/server";
import { appRouter } from "@/lib/server/routers/_app";
import { createTRPCContext } from "@/lib/trpc/context";
import { env } from "@/lib/env.mjs";


const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };