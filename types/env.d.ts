import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<ReturnType<typeof import('../env.mjs').env>> {}
  }
}