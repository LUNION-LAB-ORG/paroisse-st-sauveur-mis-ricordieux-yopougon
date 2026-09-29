/**
 * Rôles du back-office (specs §5.1). Le serveur vérifie les droits ; ce module
 * ne sert qu'à adapter l'interface (menu, boutons) au rôle connecté.
 */
export type IRole =
  | "admin"
  | "priest"
  | "secretariat"
  | "communication"
  | "treasurer"
  | "movement_leader";

export const LIBELLES_ROLES: Record<IRole, string> = {
  admin: "Administrateur",
  priest: "Curé / prêtre",
  secretariat: "Secrétariat",
  communication: "Communication",
  treasurer: "Trésorier",
  movement_leader: "Responsable de mouvement",
};

/** Modules du back-office (une entrée de menu = un module). */
export type IModule =
  | "tableau"
  | "liturgie"
  | "horaires"
  | "annonces"
  | "evenements"
  | "publications"
  | "mouvements"
  | "equipe"
  | "histoire"
  | "messes"
  | "dons"
  | "rendez-vous"
  | "commentaires"
  | "abonnes"
  | "parametres"
  | "autres";

/** Modules modifiables par rôle (lecture ouverte à tous les comptes connectés). */
const ECRITURE: Record<IRole, IModule[] | "*"> = {
  admin: "*",
  priest: [
    "tableau",
    "liturgie",
    "histoire",
    "rendez-vous",
    "publications",
    "commentaires",
  ],
  secretariat: [
    "tableau",
    "horaires",
    "annonces",
    "messes",
    "rendez-vous",
    "dons",
  ],
  communication: [
    "tableau",
    "publications",
    "evenements",
    "commentaires",
    "histoire",
    "autres",
  ],
  treasurer: ["tableau", "dons"],
  movement_leader: ["tableau", "mouvements"],
};

/** Modules visibles dans le menu : écriture + consultation utile au rôle. */
const VISIBLES: Record<IRole, IModule[] | "*"> = {
  admin: "*",
  priest: [
    "tableau",
    "liturgie",
    "horaires",
    "annonces",
    "evenements",
    "publications",
    "equipe",
    "histoire",
    "messes",
    "rendez-vous",
    "commentaires",
  ],
  secretariat: [
    "tableau",
    "liturgie",
    "horaires",
    "annonces",
    "evenements",
    "equipe",
    "messes",
    "dons",
    "rendez-vous",
    "abonnes",
  ],
  communication: [
    "tableau",
    "horaires",
    "annonces",
    "evenements",
    "publications",
    "mouvements",
    "histoire",
    "commentaires",
    "abonnes",
    "autres",
  ],
  treasurer: ["tableau", "dons", "messes"],
  movement_leader: ["tableau", "mouvements"],
};

export const roleConnu = (r: string | undefined | null): IRole =>
  (r && r in LIBELLES_ROLES ? r : "admin") as IRole;

export const peutModifier = (role: IRole, module: IModule) => {
  const droits = ECRITURE[role];

  return droits === "*" || droits.includes(module);
};

export const peutVoir = (role: IRole, module: IModule) => {
  const droits = VISIBLES[role];

  return droits === "*" || droits.includes(module);
};
