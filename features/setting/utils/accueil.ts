import type { ISettingsMap } from "../types/setting.type";

/** Blocs de l'accueil pilotés par le paramètre `home.sections` (le héros reste toujours en tête). */
export const SECTIONS_ACCUEIL = [
  "infos",
  "horaires",
  "parole",
  "eglise",
  "mouvements",
  "actualites",
  "histoire",
  "equipe",
  "whatsapp",
] as const;

export type ICleSectionAccueil = (typeof SECTIONS_ACCUEIL)[number];

const estCle = (v: unknown): v is ICleSectionAccueil =>
  typeof v === "string" && (SECTIONS_ACCUEIL as readonly string[]).includes(v);

/**
 * Ordre et visibilité des blocs de l'accueil.
 * JSON attendu : `[{ "key": "horaires", "visible": true }, …]`. Valeur absente
 * ou invalide → ordre de la maquette, tout visible. Les clés inconnues sont
 * ignorées ; les clés oubliées sont ajoutées à la fin (visibles).
 */
export function sectionsAccueil(s: ISettingsMap): ICleSectionAccueil[] {
  const valeur: unknown = s["home.sections"];
  let brut: unknown = null;

  try {
    brut = typeof valeur === "string" ? JSON.parse(valeur) : valeur;
  } catch {
    brut = null;
  }
  if (!Array.isArray(brut)) return [...SECTIONS_ACCUEIL];

  const vues = new Set<ICleSectionAccueil>();
  const visibles: ICleSectionAccueil[] = [];

  for (const item of brut) {
    const cle = (item as { key?: unknown } | null)?.key;

    if (!estCle(cle) || vues.has(cle)) continue;
    vues.add(cle);
    const visible = (item as { visible?: unknown }).visible;

    if (
      visible !== false &&
      visible !== 0 &&
      visible !== "0" &&
      visible !== "false"
    )
      visibles.push(cle);
  }

  return [...visibles, ...SECTIONS_ACCUEIL.filter((c) => !vues.has(c))];
}
