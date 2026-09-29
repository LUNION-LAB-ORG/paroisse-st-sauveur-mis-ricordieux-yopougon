export type IFormule = "single" | "triduum" | "novena";
export type IMoyenPaiement =
  | "wave"
  | "orange"
  | "mtn"
  | "moov"
  | "card"
  | "secretariat";
export type IStatutCreneau = "available" | "almost_full" | "full" | "too_late";

export interface ICreneauMesse {
  time_slot_id: number;
  time: string;
  label: string;
  capacity: number | null;
  taken: number;
  status: IStatutCreneau;
}

export interface IJourMesse {
  date: string;
  weekday: number;
  slots: ICreneauMesse[];
}

export interface IDisponibilites {
  offering_amount: number | null;
  min_offering: number;
  min_delay_hours: number;
  days: IJourMesse[];
}

export interface IMesseProgrammee {
  date: string;
  time: string;
  label: string;
  shifted: boolean;
}

export interface IDemandeMesseCreer {
  intention_type: string;
  for_whom: string;
  intention?: string;
  is_confidential: boolean;
  formula: IFormule;
  date: string;
  time_slot_id: number;
  fullname: string;
  phone: string;
  email?: string;
  will_attend: boolean;
  reminder: boolean;
  offering: "indicative" | "free";
  amount?: number;
  payment_method: IMoyenPaiement;
}

export interface IDemandeMesseCreee {
  number: string;
  access_token: string;
  amount: number;
  payment_status: string;
  payment_method: IMoyenPaiement;
  wave_launch_url: string | null;
  schedules: IMesseProgrammee[];
}

export interface IDemandeMesse extends IDemandeMesseCreee {
  intention_type: string;
  for_whom: string;
  is_confidential: boolean;
  formula: IFormule;
  fullname: string;
  created_at: string;
}
