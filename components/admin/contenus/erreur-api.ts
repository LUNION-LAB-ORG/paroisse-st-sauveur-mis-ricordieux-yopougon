/**
 * Lecture des erreurs renvoyées par l'API (client `ak-api-http`) : statut HTTP,
 * message lisible en français et erreurs de validation Laravel (422) par champ.
 */
interface IErreurApi {
  status?: number;
  message?: string;
  context?: string;
}

function donneesReponse(err: unknown): Record<string, unknown> | null {
  const ctx = (err as IErreurApi)?.context;

  if (!ctx) return null;
  try {
    const parsed = JSON.parse(ctx) as { responseData?: unknown };

    return (parsed.responseData as Record<string, unknown>) ?? null;
  } catch {
    return null;
  }
}

export const statutErreur = (err: unknown): number | undefined =>
  (err as IErreurApi)?.status;

/** Erreurs de validation (422) : `{ champ: "message" }`. */
export function erreursChamps(err: unknown): Record<string, string> {
  const donnees = donneesReponse(err);
  const erreurs = donnees?.errors as Record<string, string[]> | undefined;

  if (!erreurs) return {};

  return Object.fromEntries(
    Object.entries(erreurs).map(([k, v]) => [
      k,
      Array.isArray(v) ? v[0] : String(v),
    ]),
  );
}

/** Message à afficher pour une erreur d'API. */
export function messageErreur(
  err: unknown,
  defaut = "L’opération a échoué. Réessayez.",
): string {
  const statut = statutErreur(err);
  const donnees = donneesReponse(err);

  if (statut === 403)
    return (
      (donnees?.error as string) ??
      "Accès refusé pour votre rôle : vous ne pouvez pas modifier ce module."
    );
  if (statut === 404 || statut === 405)
    return "Cette fonction n’est pas encore disponible sur le serveur.";
  if (statut === 422) {
    const premiere = Object.values(erreursChamps(err))[0];

    return (
      premiere ??
      (donnees?.message as string) ??
      "Certains champs sont invalides."
    );
  }
  if (statut && statut >= 500)
    return "Le serveur a rencontré une erreur. Réessayez dans un instant.";
  if (!statut) return "Le serveur est injoignable. Vérifiez la connexion.";

  return (donnees?.message as string) ?? defaut;
}
