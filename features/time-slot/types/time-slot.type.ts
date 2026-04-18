export type ITimeSlotType = "messe" | "ecoute" | "confession" | "adoration" | "autre";

export interface ITimeSlot {
  id: number;
  type: ITimeSlotType | string;
  priest_id: number | null;
  weekday: number; // 0 = dimanche … 6 = samedi
  start_time: string;
  end_time: string;
  capacity: number | null;
  notes: string | null;
  is_available: boolean;
  created_at?: string;
}

export interface ITimeSlotCreer {
  type: ITimeSlotType;
  priest_id?: number | null;
  weekday: number;
  start_time: string;
  end_time: string;
  capacity?: number | null;
  notes?: string | null;
  is_available?: boolean;
}

export interface ITimeSlotModifier extends Partial<ITimeSlotCreer> {}

/** Une occurrence calculée renvoyée par /api/time-slots/available */
export interface ISlotOccurrence {
  slot_id: number;
  type: ITimeSlotType | string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  capacity: number | null;
  taken: number;
  available: number | null;
  label: string;
  iso_datetime: string;
}

export const WEEKDAYS_FR: { value: number; short: string; long: string }[] = [
  { value: 0, short: "Dim", long: "Dimanche" },
  { value: 1, short: "Lun", long: "Lundi" },
  { value: 2, short: "Mar", long: "Mardi" },
  { value: 3, short: "Mer", long: "Mercredi" },
  { value: 4, short: "Jeu", long: "Jeudi" },
  { value: 5, short: "Ven", long: "Vendredi" },
  { value: 6, short: "Sam", long: "Samedi" },
];

export const TIME_SLOT_TYPES: { value: ITimeSlotType; label: string; color: string }[] = [
  { value: "messe", label: "Messe", color: "bg-[#2d2d83]/10 text-[#2d2d83]" },
  { value: "ecoute", label: "Écoute", color: "bg-[#98141f]/10 text-[#98141f]" },
  { value: "confession", label: "Confession", color: "bg-amber-100 text-amber-700" },
  { value: "adoration", label: "Adoration", color: "bg-indigo-100 text-indigo-700" },
  { value: "autre", label: "Autre", color: "bg-gray-100 text-gray-700" },
];
