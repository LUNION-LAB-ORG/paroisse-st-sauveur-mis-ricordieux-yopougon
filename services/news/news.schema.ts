import { z } from "zod";

/* ---------------- SCHÉMA CRÉATION ---------------- */

export const NewsSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Le titre est obligatoire" }),

  image: z
    .union([
      z.instanceof(File),      // upload côté front
      z.string().url()         // image déjà existante (API)
    ])
    .optional(),

  new_resume: z
    .string()
    .min(1, { message: "Le résumé est obligatoire" }),

  location: z
    .string()
    .min(1, { message: "La localisation est obligatoire" }),

  content: z
    .string()
    .min(1, { message: "Le contenu est obligatoire" }),

  new_status: z
    .enum(["draft", "published", "archived"])
    .optional(),

  published_at: z
    .string()
    .optional(),
});

/* ---------------- TYPE TS ---------------- */

export type NewsType = z.infer<typeof NewsSchema>;

/* ---------------- SCHÉMA UPDATE ---------------- */

export const UpdateNewsSchema = NewsSchema.partial();
export type UpdateNewsType = z.infer<typeof UpdateNewsSchema>;
