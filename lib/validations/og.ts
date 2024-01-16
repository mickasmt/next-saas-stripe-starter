import * as z from "zod"
import { linkSchema } from "@/zodAutoGenSchemas";

export const ogImageSchema = z.object({
  heading: z.string(),
  type: z.string(),
  mode: z.enum(["light", "dark"]).default("dark"),
})

export const urlSchema = linkSchema.pick({ url: true }).refine((data) => {
  // URL validation logic:
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return urlRegex.test(data.url);
}, {
  message: "Invalid URL format",
});

