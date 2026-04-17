import { z } from "zod";

/* ---------------- SCHEMA PRINCIPAL ---------------- */

export const MesseSchema = z.object({
  id: z.number().optional(),

  type: z.string().min(1, { message: "Le type de messe est obligatoire" }),

  fullname: z.string().min(1, { message: "Le nom complet est obligatoire" }),

  email: z.string().email({ message: "Email invalide" }).nullable().optional(),

  phone: z.string().min(1, { message: "Le numero de telephone est obligatoire" }),

  message: z.string().min(1, { message: "Le message est obligatoire" }),

  request_status: z.enum(["pending", "accepted", "canceled"]),

  payment_status: z.enum(["pending", "succeeded", "failed"]).nullable().optional(),

  amount: z.number().positive({ message: "Le montant doit etre superieur a 0" }),

  date_at: z.string().datetime({ message: "Date invalide" }),

  time_at: z.string().datetime({ message: "Heure invalide" }),

  created_at: z.string().optional(),
});

/* ---------------- TYPE TS ---------------- */

export type MesseSchemaType = z.infer<typeof MesseSchema>;

/* ---------------- SCHEMA CREATION ---------------- */

export const CreerMesseSchema = MesseSchema.omit({
  id: true,
  created_at: true,
});

export type CreerMesseSchemaType = z.infer<typeof CreerMesseSchema>;

/* ---------------- SCHEMA UPDATE ---------------- */

export const ModifierMesseSchema = CreerMesseSchema.partial();
export type ModifierMesseSchemaType = z.infer<typeof ModifierMesseSchema>;

export type MesseFormData = Omit<CreerMesseSchemaType, "id" | "created_at">;

/** Alias pour compatibilite ascendante */
export { MesseSchema as IntentionSchema };
export type { MesseSchemaType as IntentionType };
