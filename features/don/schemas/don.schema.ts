import { z } from "zod";

/* ---------------- SCHEMA PRINCIPAL ---------------- */

export const DonSchema = z.object({
  id: z.number().optional(),

  montant: z
    .number()
    .positive({ message: "Le montant doit etre superieur a 0" }),

  projet: z
    .string()
    .min(1, { message: "Le projet est obligatoire" }),

  donateur: z
    .string()
    .min(1, { message: "Le nom du donateur est obligatoire" }),

  modePaiement: z.enum(["carte", "virement", "especes", "cheque", "mobile_money"], {
    required_error: "Le mode de paiement est obligatoire",
  }),

  statut: z
    .enum(["en_attente", "confirme", "annule", "rembourse"])
    .default("en_attente"),

  created_at: z.string().optional(),
});

/* ---------------- TYPE TS ---------------- */

export type DonSchemaType = z.infer<typeof DonSchema>;

/* ---------------- SCHEMA CREATION ---------------- */

export const CreerDonSchema = DonSchema.omit({
  id: true,
  created_at: true,
});

export type CreerDonSchemaType = z.infer<typeof CreerDonSchema>;

/* ---------------- SCHEMA UPDATE ---------------- */

export const ModifierDonSchema = CreerDonSchema.partial();
export type ModifierDonSchemaType = z.infer<typeof ModifierDonSchema>;
