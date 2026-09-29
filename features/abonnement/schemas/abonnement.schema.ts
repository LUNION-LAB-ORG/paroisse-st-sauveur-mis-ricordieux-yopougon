import { z } from "zod";

export const abonnementSchema = z.object({
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .refine(
      (v) => /^\+?\d{8,15}$/.test(v),
      "Numéro WhatsApp invalide (ex. +225 07 00 00 00 00)",
    ),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Votre accord est nécessaire pour recevoir les messages.",
    }),
  }),
});

export type AbonnementDTO = z.infer<typeof abonnementSchema>;
