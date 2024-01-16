import { linkSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getLinks } from "@/lib/api/links/queries";


// Schema for links - used to validate API requests
export const insertLinkSchema = linkSchema.omit({ id: true });

export const insertLinkParams = linkSchema.extend({
  order: z.coerce.number(),
  listId: z.coerce.string().min(1)
}).omit({ 
  id: true,
  userId: true
});

export const updateLinkSchema = linkSchema;

export const updateLinkParams = updateLinkSchema.extend({
  order: z.coerce.number(),
  listId: z.coerce.string().min(1)
}).omit({ 
  userId: true
});

export const linkIdSchema = updateLinkSchema.pick({ id: true });

// Types for links - used to type API request params and within Components
export type Link = z.infer<typeof updateLinkSchema>;
export type NewLink = z.infer<typeof insertLinkSchema>;
export type NewLinkParams = z.infer<typeof insertLinkParams>;
export type UpdateLinkParams = z.infer<typeof updateLinkParams>;
export type LinkId = z.infer<typeof linkIdSchema>["id"];
    
// this type infers the return from getLinks() - meaning it will include any joins
export type CompleteLink = Awaited<ReturnType<typeof getLinks>>["links"][number];

