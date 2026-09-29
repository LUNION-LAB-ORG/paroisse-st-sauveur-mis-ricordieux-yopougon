/** Identifiant anonyme de l'appareil pour les J'aime (1 par appareil, sans compte). */
const CLE = "ssm-appareil";
let enMemoire: string | null = null;

export function identifiantAppareil(): string {
  if (enMemoire) return enMemoire;
  try {
    enMemoire = window.localStorage.getItem(CLE);
    if (!enMemoire) {
      enMemoire = crypto.randomUUID();
      window.localStorage.setItem(CLE, enMemoire);
    }
  } catch {
    // Stockage indisponible (navigation privée) : identifiant valable le temps de la visite
    enMemoire ??= crypto.randomUUID();
  }

  return enMemoire;
}
