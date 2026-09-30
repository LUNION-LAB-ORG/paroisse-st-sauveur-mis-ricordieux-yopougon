import type { ISettingsMap } from "../types/setting.type";
import type { IIdentiteParoisse } from "./identite";

/** Contenu de la bannière d'accueil, piloté depuis Paramètres › Page d'accueil. */
export interface IContenuHero {
  surTitre: string;
  titre: string;
  texte: string;
  image: string | null;
  legende: string;
  boutonPrincipal: { libelle: string; lien: string };
  boutonSecondaire: { libelle: string; lien: string };
  lienImage: { libelle: string; lien: string };
}

/** Lien accepté : page du site (/…) ou adresse http(s) ; sinon le lien par défaut. */
export function lienSur(valeur: string | undefined, defaut: string) {
  const lien = (valeur ?? "").trim();

  return /^(\/(?!\/)|https?:\/\/)\S*$/i.test(lien) ? lien : defaut;
}

export function contenuHero(
  s: ISettingsMap,
  identite: IIdentiteParoisse,
): IContenuHero {
  const v = (cle: string, defaut: string) => (s[cle] ?? "").trim() || defaut;

  return {
    surTitre: v("hero.eyebrow", identite.devise),
    titre: v("hero.title", identite.nom),
    texte: v("hero.text", identite.description),
    image: identite.vueEglise,
    legende: v("hero.image_caption", "Vue d’architecte de la future église"),
    boutonPrincipal: {
      libelle: v("hero.primary_label", "Soutenir la construction"),
      lien: lienSur(s["hero.primary_url"], "/nouvelle-eglise"),
    },
    boutonSecondaire: {
      libelle: v("hero.secondary_label", "Horaires des messes"),
      lien: lienSur(s["hero.secondary_url"], "/horaires"),
    },
    lienImage: {
      libelle: (s["hero.link_label"] ?? "Suivre le projet").trim(),
      lien: lienSur(s["hero.link_url"], "/nouvelle-eglise"),
    },
  };
}
