import { z } from "zod";

export const EventSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  date_at: z.string().datetime({ message: "date_at doit être un datetime ISO valide" }),
  time_at: z.string().min(1, "L'heure est obligatoire"),
  location_at: z.string().min(1, "Le lieu est obligatoire"),
  description: z.string().min(1, "La description est obligatoire"),
  image: z.string().min(1, "L'image est obligatoire"),
});
export type EventTypeSchema = z.infer<typeof EventSchema>;