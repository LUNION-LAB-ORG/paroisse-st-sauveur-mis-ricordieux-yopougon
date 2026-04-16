import { z } from "zod";

/* ---------------- SCHEMA PRINCIPAL ---------------- */

export const EcouteSchema = z.object({
  id: z.number().optional(),

  type: z.string().optional(),

  fullname: z.string().min(1, { message: "Le nom complet est obligatoire" }),

  phone: z.string().optional(),

  availability: z.string().min(1, { message: "Les disponibilites sont obligatoires" }),

  message: z.string().min(1, { message: "Le message est obligatoire" }),

  acceptConditions: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions",
  }),

  request_status: z.enum(["pending", "accepted", "canceled"]).default("pending"),

  created_at: z.string().optional(),
});

/* ---------------- TYPE TS ---------------- */

export type EcouteSchemaType = z.infer<typeof EcouteSchema>;

/* ---------------- SCHEMA CREATION ---------------- */

export const CreerEcouteSchema = EcouteSchema.omit({
  id: true,
  created_at: true,
});

export type CreerEcouteSchemaType = z.infer<typeof CreerEcouteSchema>;

/* ---------------- SCHEMA UPDATE ---------------- */

export const ModifierEcouteSchema = CreerEcouteSchema.partial();
export type ModifierEcouteSchemaType = z.infer<typeof ModifierEcouteSchema>;

export type EcouteFormData = Omit<CreerEcouteSchemaType, "id" | "created_at">;

/** Alias pour compatibilite ascendante */
export type { EcouteSchemaType as EcouteType };
export { CreerEcouteSchema as CreateEcouteSchema };
