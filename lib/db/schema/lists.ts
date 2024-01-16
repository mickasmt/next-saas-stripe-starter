import { listSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getLists } from "@/lib/api/lists/queries";


// Schema for lists - used to validate API requests
export const insertListSchema = listSchema.omit({ id: true });

export const insertListParams = listSchema.extend({
  public: z.coerce.boolean(),
  shares: z.coerce.number()
}).omit({ 
  id: true,
  userId: true
});

export const updateListSchema = listSchema;

export const updateListParams = updateListSchema.extend({
  public: z.coerce.boolean(),
  shares: z.coerce.number()
}).omit({ 
  userId: true
});

export const listIdSchema = updateListSchema.pick({ id: true });

// Types for lists - used to type API request params and within Components
export type List = z.infer<typeof updateListSchema>;
export type NewList = z.infer<typeof insertListSchema>;
export type NewListParams = z.infer<typeof insertListParams>;
export type UpdateListParams = z.infer<typeof updateListParams>;
export type ListId = z.infer<typeof listIdSchema>["id"];
    
// this type infers the return from getLists() - meaning it will include any joins
export type CompleteList = Awaited<ReturnType<typeof getLists>>["lists"][number];



export type ListWithOptionalError = List & { error?: string };
export type NewListWithOptionalError = NewList & { error?: string };
export type NewListParamsWithOptionalError = NewListParams & { error?: string };
export type UpdateListParamsWithOptionalError = UpdateListParams & { error?: string };
export type CompleteListWithOptionalError = CompleteList & { error?: string };