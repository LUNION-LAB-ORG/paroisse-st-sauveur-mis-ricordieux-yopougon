import { z } from "zod";

/* ---------------- SCHEMA PRINCIPAL ---------------- */

export const MediationSchema = z.object({
  id: z.number().optional(),

  type: z.enum(["familiale", "conjugale", "communautaire", "autre"], {
    required_error: "Le type de mediation est obligatoire",
  }),

  demandeur: z
    .string()
    .min(1, { message: "Le nom du demandeur est obligatoire" }),

  email: z
    .string()
    .email({ message: "Email invalide" })
    .optional(),

  telephone: z
    .string()
    .min(1, { message: "Le numero de telephone est obligatoire" }),

  description: z
    .string()
    .min(10, { message: "La description doit contenir au moins 10 caracteres" }),

  statut: z
    .enum(["en_attente", "en_cours", "resolue", "annulee"])
    .default("en_attente"),

  dateDisponibilite: z
    .string()
    .optional(),

  created_at: z.string().optional(),
});

/* ---------------- TYPE TS ---------------- */

export type MediationSchemaType = z.infer<typeof MediationSchema>;

/* ---------------- SCHEMA CREATION ---------------- */

export const CreerMediationSchema = MediationSchema.omit({
  id: true,
  created_at: true,
});

export type CreerMediationSchemaType = z.infer<typeof CreerMediationSchema>;

/* ---------------- SCHEMA UPDATE ---------------- */

export const ModifierMediationSchema = CreerMediationSchema.partial();
export type ModifierMediationSchemaType = z.infer<typeof ModifierMediationSchema>;
