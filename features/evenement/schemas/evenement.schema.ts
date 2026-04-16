import { z } from "zod";

export const evenementSchema = z.object({
  title: z.string().min(1, { message: "Le titre est obligatoire" }),
  date_at: z.string().min(1, { message: "La date est obligatoire" }),
  time_at: z.string().min(1, { message: "L'heure est obligatoire" }),
  location_at: z.string().min(1, { message: "Le lieu est obligatoire" }),
  description: z
    .string()
    .min(1, { message: "La description est obligatoire" }),
  image: z.instanceof(File).optional(),
});

export type EvenementSchema = z.infer<typeof evenementSchema>;

export const modifierEvenementSchema = evenementSchema.partial();
export type ModifierEvenementSchema = z.infer<typeof modifierEvenementSchema>;

/** Alias pour compatibilite ascendante */
export {
  evenementSchema as EventSchema,
  modifierEvenementSchema as UpdateEventSchema,
};
export type { EvenementSchema as EventTypeSchema };
export type { ModifierEvenementSchema as UpdateEventTypeSchema };
