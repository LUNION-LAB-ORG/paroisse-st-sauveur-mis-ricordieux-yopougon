/** Valeurs des paramètres en cours d'édition (clé → valeur texte). */
export type IValeurs = Record<string, string>;

export interface IPropsOnglet {
  valeurs: IValeurs;
  /** Met à jour une clé (marque le formulaire comme modifié) */
  changer: (cle: string, valeur: string) => void;
  /** Types des paramètres (image, secret…) */
  types: Record<string, string>;
  /** Paramètres secrets déjà renseignés côté serveur */
  secretsDefinis: Record<string, boolean>;
  peutModifier: boolean;
  /** Recharge les paramètres après un envoi de fichier */
  recharger: () => void;
}

/** Sections de l'accueil pilotables (clé technique → libellé de la maquette). */
export const SECTIONS_ACCUEIL = [
  { key: "infos", label: "Bande d’informations du jour" },
  { key: "horaires", label: "Horaires de la semaine" },
  { key: "parole", label: "Parole du jour" },
  { key: "eglise", label: "Nouvelle église et dons" },
  { key: "mouvements", label: "Mouvements et groupes" },
  { key: "actualites", label: "Vie de la communauté" },
  { key: "histoire", label: "Histoire et mot du curé" },
  { key: "equipe", label: "Équipe presbytérale" },
  { key: "whatsapp", label: "Abonnement WhatsApp" },
] as const;

export interface ISectionAccueil {
  key: string;
  visible: boolean;
}

/** Lit `home.sections` ; complète avec les sections absentes (visibles, en fin de liste). */
export function lireSections(json: string | undefined): ISectionAccueil[] {
  let liste: ISectionAccueil[] = [];

  try {
    const brut = JSON.parse(json || "[]");

    if (Array.isArray(brut))
      liste = brut
        .filter((s) => s && typeof s.key === "string")
        .map((s) => ({ key: s.key, visible: s.visible !== false }));
  } catch {
    liste = [];
  }
  const connues = new Set(liste.map((s) => s.key));

  return [
    ...liste.filter((s) => SECTIONS_ACCUEIL.some((x) => x.key === s.key)),
    ...SECTIONS_ACCUEIL.filter((s) => !connues.has(s.key)).map((s) => ({
      key: s.key,
      visible: true,
    })),
  ];
}
