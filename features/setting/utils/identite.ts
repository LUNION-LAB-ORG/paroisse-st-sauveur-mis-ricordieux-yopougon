import type { ISettingsMap } from "../types/setting.type";

import { LOGO_PAR_DEFAUT } from "@/lib/charte";

/** Identité de la paroisse lue depuis les paramètres, avec les valeurs par défaut de la charte. */
export interface IIdentiteParoisse {
  nom: string;
  devise: string;
  description: string;
  diocese: string;
  adresse: string;
  telephone: string;
  email: string;
  logo: string;
  vueEglise: string | null;
  reseaux: {
    facebook: string;
    youtube: string;
    instagram: string;
    whatsapp: string;
  };
}

export function identiteParoisse(s: ISettingsMap): IIdentiteParoisse {
  const v = (cle: string, defaut = "") => (s[cle] ?? "").trim() || defaut;

  return {
    nom: v("parish.name", "Paroisse Saint Sauveur Miséricordieux"),
    devise: v("parish.tagline", "Le Sanctuaire de la Miséricorde"),
    description: v(
      "parish.description",
      "Une communauté vivante et accueillante à Yopougon Millionnaire.",
    ),
    diocese: v("parish.diocese", "Archidiocèse d’Abidjan"),
    adresse: v("parish.address"),
    telephone: v("parish.phone"),
    email: v("parish.email"),
    logo: v("images.logo", LOGO_PAR_DEFAUT),
    vueEglise: v("images.church_render") || null,
    reseaux: {
      facebook: v("social.facebook"),
      youtube: v("social.youtube"),
      instagram: v("social.instagram"),
      whatsapp: v("social.whatsapp"),
    },
  };
}
