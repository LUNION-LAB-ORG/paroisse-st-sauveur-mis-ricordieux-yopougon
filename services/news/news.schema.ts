// src/services/news/news.schema.ts
import { z } from "zod";

/**
 * Schéma Zod pour un seul item d'actualité / article
 */
export const NewsSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string().nullable().optional(),   // author peut être absent ou null selon l'API
  category: z.string().nullable().optional(),
  status: z.string().nullable().optional(),   // "published", "draft", ... -> on laisse string pour la souplesse
  views: z.number().int().nonnegative(),
  // published_at dans ton exemple est un ISO datetime (avec "T") -> on peut valider comme datetime ISO
  published_at: z
    .string()
    .datetime()
    .nullable()
    .optional(),
  // created_at dans ton exemple est "YYYY-MM-DD HH:mm:ss" (sans "T") — on accepte une string brute,
  // ou si tu veux vérifier le format exact, remplacer z.string() par la version commentée ci-dessous.
  created_at: z.string(),
});

/**
 * Schéma Zod pour la réponse contenant `data: NewsItem[]`
 */
export const NewsListSchema = z.object({
  data: z.array(NewsSchema),
  // si ton API renvoie aussi `meta`/`links`, tu peux les ajouter ici :
  // meta: z.any().optional(),
  // links: z.any().optional(),
});

/**
 * Types TypeScript inférés depuis Zod
 */
export type NewsItemType = z.infer<typeof NewsSchema>;
export type NewsListResponse = z.infer<typeof NewsListSchema>;
