export type IMesseStatutDemande = "pending" | "accepted" | "canceled";
export type IMessePaymentStatus = "pending" | "succeeded" | "failed" | null;

export interface IMesse {
  id?: number;
  type: string;
  fullname: string;
  email?: string | null;
  phone: string;
  message: string;
  amount: number;
  date_at: string;
  time_at: string;
  request_status: IMesseStatutDemande;
  payment_status?: IMessePaymentStatus;
  wave_reference?: string | null;
  wave_checkout_id?: string | null;
  created_at?: string;
}

export interface IMesseCreer {
  type: string;
  fullname: string;
  email?: string | null;
  phone: string;
  message: string;
  amount: number;
  date_at: string;
  time_at: string;
  request_status: IMesseStatutDemande;
  payment_status?: IMessePaymentStatus;
}

export interface IMesseModifier extends Partial<IMesseCreer> {}

export interface IMesseFormData extends Omit<IMesseCreer, "id" | "created_at"> {}

/** Alias pour compatibilite ascendante */
export type RequestStatus = IMesseStatutDemande;
export type IntentionType = IMesse;
