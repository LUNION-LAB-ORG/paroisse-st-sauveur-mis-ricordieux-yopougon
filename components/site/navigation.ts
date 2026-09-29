/** Liens de navigation du site public (en-tête, tiroir mobile). */
export const LIENS_PRINCIPAUX = [
  { label: "Vie paroissiale", href: "/vie-paroissiale" },
  { label: "Parole du jour", href: "/parole-du-jour" },
  { label: "Nouvelle église", href: "/nouvelle-eglise" },
  { label: "Communauté", href: "/communaute" },
  { label: "Annonces", href: "/annonces" },
  { label: "Contact", href: "/contact" },
] as const;

export const MENU_PAROISSE = [
  {
    titre: "Notre histoire",
    description: "Des origines à aujourd’hui",
    href: "/histoire",
  },
  {
    titre: "Équipe pastorale",
    description: "Prêtres, conseil, secrétariat",
    href: "/equipe",
  },
  {
    titre: "Horaires et sacrements",
    description: "Messes, confessions, baptêmes",
    href: "/horaires",
  },
  {
    titre: "Agenda",
    description: "Célébrations et événements à venir",
    href: "/agenda",
  },
  {
    titre: "Demander une messe",
    description: "Confier une intention à la communauté",
    href: "/demande-messe",
  },
  {
    titre: "Nous trouver",
    description: "Plan d’accès et contact",
    href: "/contact",
  },
] as const;

/** Page de don (le bloc de don rapide y envoie ses choix en paramètres). */
export const LIEN_DON = "/don";
