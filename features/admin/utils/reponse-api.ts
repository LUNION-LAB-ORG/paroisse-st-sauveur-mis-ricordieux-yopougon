/**
 * Réponses de l'API Laravel côté back-office : pagination standard et
 * traduction des erreurs d'`ak-api-http` en messages français.
 */

/** Réponse paginée standard de Laravel (`JsonResource::collection($paginator)`). */
export interface IPageLaravel<T> {
  data: T[];
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
    [cle: string]: unknown;
  };
}

/** Traduit une erreur d'`ak-api-http` en message lisible pour l'utilisateur. */
export function messageErreur(
  e: unknown,
  parDefaut = "L’opération a échoué.",
): string {
  const err = e as {
    status?: number;
    message?: string;
    context?: string;
  } | null;

  if (!err) return parDefaut;
  if (err.status === 403) return "Accès refusé pour votre rôle.";
  if (err.status === 404) return "Élément introuvable ou service indisponible.";
  let donnees: {
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
  } | null = null;

  try {
    donnees = err.context ? JSON.parse(err.context).responseData : null;
  } catch {
    donnees = null;
  }
  if (donnees?.errors) {
    const premiere = Object.values(donnees.errors)[0]?.[0];

    if (premiere) return premiere;
  }
  if (donnees?.error) return donnees.error;
  if (donnees?.message && donnees.message !== "Server Error")
    return donnees.message;
  if (err.status && err.status >= 500)
    return "Le serveur a rencontré une erreur. Réessayez dans un instant.";
  if (err.message && !/status code|Network Error/i.test(err.message))
    return err.message;

  return parDefaut;
}

/** Erreurs de validation 422 par champ (`errors.champ[0]`). */
export function erreursChamps(e: unknown): Record<string, string> {
  const err = e as { status?: number; context?: string } | null;

  if (err?.status !== 422 || !err.context) return {};
  try {
    const erreurs = JSON.parse(err.context).responseData?.errors ?? {};

    return Object.fromEntries(
      Object.entries(erreurs as Record<string, string[]>).map(([k, v]) => [
        k,
        v[0],
      ]),
    );
  } catch {
    return {};
  }
}
