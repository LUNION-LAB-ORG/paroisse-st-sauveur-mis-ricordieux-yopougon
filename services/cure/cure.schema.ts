import { z } from "zod";

export const PastorItemSchema = z.object({
  id: z.number(),
  fullname: z.string(),
  started_at: z.string(),
  ended_at: z.string().nullable(),
  description: z.string(),
  created_at: z.string().nullable(),
});

export const PastorPaginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean(),
});

export const PastorLinksSchema = z.object({
  first: z.string().nullable(),
  last: z.string().nullable(),
  prev: z.string().nullable(),
  next: z.string().nullable(),
});

export const PastorMetaSchema = z.object({
  current_page: z.number(),
  from: z.number(),
  last_page: z.number(),
  links: z.array(PastorPaginationLinkSchema),
  path: z.string(),
  per_page: z.number(),
  to: z.number(),
  total: z.number(),
});

export const PastorResponseSchema = z.object({
  data: z.array(PastorItemSchema),
  links: PastorLinksSchema,
  meta: PastorMetaSchema,
});
export type PastorItemType = z.infer<typeof PastorItemSchema>;