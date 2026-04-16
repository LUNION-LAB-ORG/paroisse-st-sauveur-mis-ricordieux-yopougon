import { z } from "zod";

/* ---------------- SCHEMA CREATION ---------------- */

export const ParticipantSchema = z.object({
  fullname: z
    .string()
    .min(1, { message: "Le nom complet est obligatoire" }),

  email: z
    .string()
    .email({ message: "L'email est invalide" })
    .min(1, { message: "L'email est obligatoire" }),

  phone: z
    .string()
    .min(1, { message: "Le numero de telephone est obligatoire" }),

  message: z
    .string()
    .min(1, { message: "Le message est obligatoire" }),

  event_id: z
    .number()
    .min(1, { message: "L'ID de l'evenement est obligatoire" }),
});

/* ---------------- TYPE TS ---------------- */

export type ParticipantSchemaType = z.infer<typeof ParticipantSchema>;

/* ---------------- SCHEMA REPONSE API ---------------- */

export const ParticipantItemSchema = z.object({
  id: z.number(),
  fullname: z.string(),
  email: z.string(),
  phone: z.string(),
  message: z.string(),
  event: z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    date_at: z.string(),
    time_at: z.string(),
    image: z.string(),
    location_at: z.string(),
    created_at: z.string(),
  }),
  created_at: z.string(),
});

export const ParticipantReponseSchema = z.object({
  data: ParticipantItemSchema,
});

export const ParticipantListeReponseSchema = z.object({
  data: z.array(ParticipantItemSchema),
});

/* ---------------- TYPES EXPORTES ---------------- */

export type ParticipantItemSchemaType = z.infer<typeof ParticipantItemSchema>;
export type ParticipantReponseSchemaType = z.infer<typeof ParticipantReponseSchema>;
export type ParticipantListeReponseSchemaType = z.infer<typeof ParticipantListeReponseSchema>;

/* ---------------- SCHEMA UPDATE ---------------- */

export const ModifierParticipantSchema = ParticipantSchema.partial();
export type ModifierParticipantSchemaType = z.infer<typeof ModifierParticipantSchema>;
