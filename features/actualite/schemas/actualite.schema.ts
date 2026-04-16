import { z } from "zod";

/* ---------------- SCHEMA PRINCIPAL ---------------- */

export const ActualiteSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Le titre est obligatoire" }),

  image: z
    .union([
      z.instanceof(File),
      z.string().url(),
    ])
    .optional(),

  new_resume: z
    .string()
    .min(1, { message: "Le resume est obligatoire" }),

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

export type ActualiteSchemaType = z.infer<typeof ActualiteSchema>;

/* ---------------- SCHEMA UPDATE ---------------- */

export const UpdateActualiteSchema = ActualiteSchema.partial();
export type UpdateActualiteSchemaType = z.infer<typeof UpdateActualiteSchema>;

/** Alias pour compatibilite ascendante */
export { ActualiteSchema as NewsSchema };
export type { ActualiteSchemaType as NewsType };
