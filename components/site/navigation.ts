/**
 * Liens de navigation du site public.
 * Les sous-pages de la maquette (Annonces, Communauté, Équipe, Agenda) arrivent
 * dans les lots suivants : en attendant, on pointe vers les blocs de l'accueil
 * ou vers les pages existantes équivalentes.
 */
export const LIENS_PRINCIPAUX = [
  { label: "Vie paroissiale", href: "/#vie" },
  { label: "Parole du jour", href: "/#parole" },
  { label: "Nouvelle église", href: "/#eglise" },
  { label: "Communauté", href: "/actualites" },
  { label: "Annonces", href: "/#annonce" },
  { label: "Contact", href: "#contact" },
] as const;

export const MENU_PAROISSE = [
  {
    titre: "Notre histoire",
    description: "Des origines à aujourd’hui",
    href: "/historique",
  },
  {
    titre: "Le mot du curé",
    description: "Message de notre pasteur",
    href: "/#cure",
  },
  {
    titre: "Équipe pastorale",
    description: "Prêtres, conseil, secrétariat",
    href: "/equipes",
  },
  {
    titre: "Horaires et sacrements",
    description: "Messes, confessions, baptêmes",
    href: "/#horaires",
  },
  {
    titre: "Demander une messe",
    description: "Confier une intention à la communauté",
    href: "/demande-messe",
  },
  {
    titre: "Nous trouver",
    description: "Plan d’accès et contact",
    href: "#contact",
  },
] as const;
