import { z } from "zod";

/* ---------------- SCHEMA PRINCIPAL ---------------- */

export const OrganisationSchema = z.object({
  isParishMember: z.enum(["yes", "no"], {
    required_error: "Veuillez indiquer si vous etes membre de la paroisse",
  }),

  movement: z
    .string()
    .min(1, "Veuillez selectionner un mouvement"),

  email: z
    .string()
    .email("Adresse email invalide"),

  eventType: z
    .string()
    .min(1, "Veuillez selectionner un type d'activite"),

  date: z
    .string()
    .min(1, "Veuillez selectionner une date"),

  startTime: z
    .string()
    .min(1, "Veuillez renseigner l'heure de debut"),

  endTime: z
    .string()
    .min(1, "Veuillez renseigner l'heure de fin"),

  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caracteres"),

  estimatedParticipants: z
    .string()
    .optional(),
});

/* ---------------- TYPE TS ---------------- */

export type OrganisationSchemaType = z.infer<typeof OrganisationSchema>;

/* ---------------- SCHEMA UPDATE ---------------- */

export const ModifierOrganisationSchema = OrganisationSchema.partial();
export type ModifierOrganisationSchemaType = z.infer<typeof ModifierOrganisationSchema>;

/** Alias pour compatibilite ascendante */
export type { OrganisationSchemaType as OrganisationType };
