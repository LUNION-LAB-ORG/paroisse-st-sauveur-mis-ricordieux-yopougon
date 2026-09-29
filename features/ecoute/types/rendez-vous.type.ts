/** Rendez-vous avec un prêtre (table `listens`, contrat api-back-office.md §9). */
export type IStatutRendezVous =
  | "pending"
  | "accepted"
  | "confirmed"
  | "closed"
  | "canceled";

export interface IPretreResume {
  id: number;
  fullname: string;
  function: string | null;
}

export interface IRendezVous {
  id: number;
  type: string | null;
  fullname: string;
  phone: string | null;
  message: string | null;
  availability: string | null;
  priest_id: number | null;
  priest: IPretreResume | null;
  assigned_priest_id: number | null;
  assigned_priest: IPretreResume | null;
  proposed_at: string | null;
  request_status: IStatutRendezVous;
  created_at: string | null;
}

export interface IRendezVousModifier {
  assigned_priest_id?: number | null;
  proposed_at?: string | null;
  request_status?: IStatutRendezVous;
}
