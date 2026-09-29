import "server-only";

import { baseURL } from "@/config/api";

/**
 * Lecture publique côté serveur pour les pages du site (RSC).
 *
 * Contrairement à `apiServer` (lib/api.ts), on n'appelle pas `auth()` : lire
 * les cookies rendrait la page dynamique et empêcherait le cache ISR. Le
 * contenu est revalidé toutes les 60 s, ce qui respecte le critère de recette
 * « une modification du back-office apparaît en moins de 60 s ».
 */
export const REVALIDATE_SECONDS = 60;

export async function fetchPublic<T>(
  endpoint: string,
  searchParams?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(`${baseURL.replace(/\/$/, "")}${endpoint}`);

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      url.searchParams.set(key, String(value));
  });

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error(`GET ${endpoint} → ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Variante tolérante pour les blocs de page : un module en panne ne doit pas
 * faire tomber toute la page d'accueil.
 */
export async function fetchPublicOrNull<T>(
  endpoint: string,
  searchParams?: Record<string, string | number | undefined>,
): Promise<T | null> {
  try {
    return await fetchPublic<T>(endpoint, searchParams);
  } catch (error) {
    console.error(
      "[api.public]",
      error instanceof Error ? error.message : error,
    );

    return null;
  }
}
