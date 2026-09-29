/** Demandes de messe côté back-office (contrat api-back-office.md §5, api-sous-pages.md §5). */

export type IStatutPaiementMesse =
  | "pending"
  | "succeeded"
  | "failed"
  | "to_pay"
  | null;
export type IStatutDemandeMesse = "pending" | "accepted" | "canceled";
export type IFormuleMesse = "single" | "triduum" | "novena";

/** Filtre de liste `?status=` */
export type IFiltreMesses = "all" | "to_process" | "to_pay" | "paid";

export interface IMesseProgrammeeAdmin {
  id: number;
  date: string;
  time: string;
  label: string | null;
  shifted: boolean;
}

export interface IDemandeMesseAdmin {
  id: number;
  number: string | null;
  type?: string | null;
  intention_type: string | null;
  for_whom: string | null;
  message: string | null;
  is_confidential: boolean;
  formula: IFormuleMesse;
  masses_count: number;
  fullname: string;
  phone: string | null;
  email: string | null;
  amount: number;
  payment_method: string | null;
  payment_status: IStatutPaiementMesse;
  request_status: IStatutDemandeMesse;
  needs_review: boolean;
  will_attend?: boolean;
  date_at: string | null;
  time_at: string | null;
  time_slot_id?: number | null;
  schedules?: IMesseProgrammeeAdmin[];
  created_at: string | null;
}

/** Saisie au secrétariat : `POST /admin/mass-requests` */
export interface ISaisieMesseSecretariat {
  intention_type: string;
  for_whom: string;
  intention?: string;
  is_confidential: boolean;
  formula: IFormuleMesse;
  date: string;
  time_slot_id: number;
  fullname: string;
  phone: string;
  email?: string;
  will_attend: boolean;
  reminder: boolean;
  offering: "indicative" | "free";
  amount?: number;
  payment_method: "secretariat" | "cash";
}

/** Liste du célébrant : `GET /mass-schedules?date=` */
export interface ICreneauCelebrant {
  time: string;
  label: string | null;
  intentions: {
    number: string | null;
    intention_type: string | null;
    for_whom: string | null;
    intention: string | null;
    payment_status: IStatutPaiementMesse;
  }[];
}
