import { z } from "zod";

/* ---------------- SCHÉMA CRÉATION ---------------- */

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
    .min(1, { message: "Le numéro de téléphone est obligatoire" }),

  message: z
    .string()
    .min(1, { message: "Le message est obligatoire" }),

  event_id: z
    .number()
    .min(1, { message: "L'ID de l'événement est obligatoire" }),
});

/* ---------------- TYPE TS ---------------- */

export type ParticipantType = z.infer<typeof ParticipantSchema>;

/* ---------------- SCHÉMA RÉPONSE API ---------------- */

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

export const ParticipantResponseSchema = z.object({
  data: ParticipantItemSchema,
});

export const ParticipantsListResponseSchema = z.object({
  data: z.array(ParticipantItemSchema),
});

/* ---------------- TYPES EXPORTÉS ---------------- */

export type ParticipantItemType = z.infer<typeof ParticipantItemSchema>;
export type ParticipantResponseType = z.infer<typeof ParticipantResponseSchema>;
export type ParticipantsListResponseType = z.infer<typeof ParticipantsListResponseSchema>;

/* ---------------- SCHÉMA UPDATE ---------------- */

export const UpdateParticipantSchema = ParticipantSchema.partial();
export type UpdateParticipantType = z.infer<typeof UpdateParticipantSchema>;
