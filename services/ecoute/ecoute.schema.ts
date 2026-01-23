import { z } from "zod";

/* ---------------- SCHÉMA PRINCIPAL ---------------- */

export const EcouteSchema = z.object({
  id: z.number().optional(),

  type: z.string().optional(),

  fullname: z.string().min(1, { message: "Le nom complet est obligatoire" }),

  phone: z.string().optional(),

  availability: z.string().min(1, { message: "Les disponibilités sont obligatoires" }),

  message: z.string().min(1, { message: "Le message est obligatoire" }),

  acceptConditions: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions",
  }),

  request_status: z.enum(["pending", "accepted", "canceled"]).default("pending"),

  created_at: z.string().optional(),
});

/* ---------------- TYPE TS ---------------- */

export type EcouteType = z.infer<typeof EcouteSchema>;

/* ---------------- SCHÉMA CRÉATION ---------------- */

export const CreateEcouteSchema = EcouteSchema.omit({
  id: true,
  created_at: true,
});

/* ---------------- TYPE TS ---------------- */

export type CreateEcouteType = z.infer<typeof CreateEcouteSchema>;

/* ---------------- SCHÉMA UPDATE ---------------- */

export const UpdateEcouteSchema = CreateEcouteSchema.partial();
export type UpdateEcouteType = z.infer<typeof UpdateEcouteSchema>;

export type EcouteFormData = Omit<CreateEcouteType, "id" | "created_at">;
