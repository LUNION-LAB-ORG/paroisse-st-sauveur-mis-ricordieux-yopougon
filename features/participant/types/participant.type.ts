export interface IParticipant {
  id: number;
  fullname: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  event_id?: number;
  payment_status?: "paid" | "succeeded" | "free" | "pending" | "failed" | null;
  wave_checkout_id?: string | null;
  payment_reference?: string | null;
  amount?: number | null;
  created_at: string;
}

export interface IParticipantCreer {
  fullname: string;
  email?: string;
  phone?: string;
  message?: string;
  event_id: number;
}

export interface IParticipantListeReponse {
  data: IParticipant[];
}

export interface IParticipantReponse {
  data: IParticipant;
}
