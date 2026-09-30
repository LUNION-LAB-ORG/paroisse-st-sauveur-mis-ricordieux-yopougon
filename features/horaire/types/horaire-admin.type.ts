export type ITypeCreneau =
  | "messe"
  | "ecoute"
  | "confession"
  | "adoration"
  | "autre";

/** Créneau récurrent de la semaine type (`time_slots`). */
export interface ICreneau {
  id: number;
  type: ITypeCreneau;
  label: string | null;
  location: string | null;
  priest_id: number | null;
  /** 0 = dimanche … 6 = samedi */
  weekday: number;
  start_time: string;
  end_time: string;
  capacity: number | null;
  notes: string | null;
  is_available: boolean;
}

export type ICreneauSaisie = Omit<ICreneau, "id" | "priest_id" | "notes">;

/** Exception datée (`schedule_exceptions`). */
export interface IException {
  id: number;
  date: string;
  start_time: string | null;
  label: string | null;
  location: string | null;
  is_cancelled: boolean;
  time_slot_id: number | null;
}

export type IExceptionSaisie = Omit<IException, "id">;

export const TYPES_CRENEAU: { valeur: ITypeCreneau; label: string }[] = [
  { valeur: "messe", label: "Messe" },
  { valeur: "confession", label: "Confessions" },
  { valeur: "adoration", label: "Adoration" },
  { valeur: "ecoute", label: "Écoute (rendez-vous)" },
  { valeur: "autre", label: "Autre" },
];

/** Libellé par défaut selon le type (comme `GET /schedule/week`). */
export const LIBELLE_PAR_TYPE: Record<string, string> = {
  messe: "Messe",
  confession: "Confessions",
  adoration: "Adoration du Saint-Sacrement",
  ecoute: "Écoute",
  autre: "Célébration",
};

/** Ordre d'affichage de la semaine type : lundi → dimanche. */
export const JOURS_SEMAINE: { weekday: number; nom: string }[] = [
  { weekday: 1, nom: "Lundi" },
  { weekday: 2, nom: "Mardi" },
  { weekday: 3, nom: "Mercredi" },
  { weekday: 4, nom: "Jeudi" },
  { weekday: 5, nom: "Vendredi" },
  { weekday: 6, nom: "Samedi" },
  { weekday: 0, nom: "Dimanche" },
];
