import { z } from "zod";

export const cureSchema = z.object({
  fullname: z
    .string()
    .min(1, { message: "Le nom complet est obligatoire" }),
  photo: z.instanceof(File).optional(),
  started_at: z
    .string()
    .min(1, { message: "La date de debut est obligatoire" }),
  ended_at: z.string().nullable().optional(),
  description: z
    .string()
    .min(1, { message: "La description est obligatoire" }),
});

export type CureType = z.infer<typeof cureSchema>;

export const modifierCureSchema = cureSchema.partial();
export type ModifierCureType = z.infer<typeof modifierCureSchema>;

/** Alias pour compatibilite ascendante */
export {
  cureSchema as CureSchema,
  modifierCureSchema as UpdateCureSchema,
};
export type { ModifierCureType as UpdateCureType };
