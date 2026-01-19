import { z } from "zod";

/* ---------------- SCHÉMA CRÉATION ---------------- */

export const organisationSchema = z.object({
  isParishMember: z.enum(['yes', 'no'], {
    required_error: 'Veuillez indiquer si vous êtes membre de la paroisse',
  }),

  movement: z
    .string()
    .min(1, 'Veuillez sélectionner un mouvement'),

  email: z
    .string()
    .email('Adresse email invalide'),

  eventType: z
    .string()
    .min(1, 'Veuillez sélectionner un type d’activité'),

  date: z
    .string()
    .min(1, 'Veuillez sélectionner une date'),

  startTime: z
    .string()
    .min(1, 'Veuillez renseigner l’heure de début'),

  endTime: z
    .string()
    .min(1, 'Veuillez renseigner l’heure de fin'),

  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères'),

  estimatedParticipants: z
    .string()
    .optional(),
});

/* ---------------- TYPE TS ---------------- */

export type OrganisationType = z.infer<typeof organisationSchema>;

/* ---------------- SCHÉMA UPDATE ---------------- */

export const updateOrganisationSchema = organisationSchema.partial();
export type UpdateOrganisationType = z.infer<typeof updateOrganisationSchema>;
