import type { IMembreConseil } from "../types/conseil.type";

const TELEPHONE = /^\+?[\d .-]{6,30}$/;

/**
 * Lit une liste collée (Excel, Word, texte) : une ligne par membre,
 * colonnes séparées par une tabulation, « ; » ou « | » :
 *   Nom et prénoms ; Fonction ; Contact
 * Les lignes d'en-tête (« Nom et prénoms », « Fonction »…) sont ignorées.
 */
export function lireListeMembres(texte: string): IMembreConseil[] {
  return texte
    .split(/\r?\n/)
    .map((ligne) =>
      ligne
        .split(/\t|;|\|/)
        .map((c) => c.replace(/\s+/g, " ").trim())
        .filter(Boolean),
    )
    .filter(
      (cols) => cols.length > 0 && !/^nom( et pr[ée]noms?)?$/i.test(cols[0]),
    )
    .map((cols) => {
      const dernier = cols[cols.length - 1];
      const phone = cols.length > 1 && TELEPHONE.test(dernier) ? dernier : null;
      const reste = phone ? cols.slice(0, -1) : cols;

      return {
        name: reste[0],
        function: reste.slice(1).join(" — ") || null,
        phone,
      };
    });
}

/** Téléphone saisi valide (vide accepté). */
export const telephoneValide = (v?: string | null) =>
  !v?.trim() || TELEPHONE.test(v.trim());
