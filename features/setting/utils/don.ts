import type { ISettingsMap } from "../types/setting.type";

const MONTANTS_PAR_DEFAUT = [5000, 10000, 25000, 50000, 100000, 250000];

/** Montants suggérés du bloc de don (paramètre `donation.amounts`). */
export function montantsSuggeres(s: ISettingsMap): number[] {
  const liste = (s["donation.amounts"] ?? "")
    .split(",")
    .map((v) => Number(v.replace(/[^\d]/g, "")))
    .filter((n) => Number.isFinite(n) && n >= 100);

  return liste.length > 0 ? liste : MONTANTS_PAR_DEFAUT;
}

/** Projet associé aux dons de l'accueil (paramètre `donation.project_label`). */
export const projetDonParDefaut = (s: ISettingsMap) =>
  (s["donation.project_label"] ?? "").trim() || "Nouvelle église";
