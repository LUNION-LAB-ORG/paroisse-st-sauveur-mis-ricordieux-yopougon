import { z } from "zod";

/* ---------------- SCHÉMA PRINCIPAL ---------------- */

export const IntentionSchema = z.object({
  id: z.number().optional(),

  type: z.string().min(1, { message: "Le type de messe est obligatoire" }),

  fullname: z.string().min(1, { message: "Le nom complet est obligatoire" }),

  email: z.string().email({ message: "Email invalide" }).nullable().optional(),

  phone: z.string().min(1, { message: "Le numéro de téléphone est obligatoire" }),

  message: z.string().min(1, { message: "Le message est obligatoire" }),

  request_status: z.enum(["pending", "accepted", "canceled"]),

  amount: z.number().positive({ message: "Le montant doit être supérieur à 0" }),

  date_at: z.string().datetime({ message: "Date invalide" }),

  time_at: z.string().datetime({ message: "Heure invalide" }),

  created_at: z.string().optional(),
});

/* ---------------- TYPE TS ---------------- */

export type IntentionType = z.infer<typeof IntentionSchema>;

/* ---------------- SCHÉMA CRÉATION ---------------- */

export const CreateIntentionSchema = IntentionSchema.omit({
  id: true,
  created_at: true,
});

/* ---------------- TYPE TS ---------------- */

export type CreateIntentionType = z.infer<typeof CreateIntentionSchema>;

/* ---------------- SCHÉMA UPDATE ---------------- */

export const UpdateIntentionSchema = CreateIntentionSchema.partial();
export type UpdateIntentionType = z.infer<typeof UpdateIntentionSchema>;

export type IntentionFormData = Omit<CreateIntentionType, "id" | "created_at">;
