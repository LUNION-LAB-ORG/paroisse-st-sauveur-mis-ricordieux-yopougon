export type IDonPaymethod = "wave" | "especes" | "cheque" | "virement" | "orange_money" | "mtn" | "autre";
export type IDonType = "monetaire" | "nature";
export type IDonPaymentStatus = "pending" | "succeeded" | "failed";

export interface IDon {
  id: number;
  donator: string;
  email?: string | null;
  phone?: string | null;
  donation_type?: IDonType;
  amount: number;
  project: string;
  paymethod: IDonPaymethod | null;
  paytransaction: string | null;
  payment_status?: IDonPaymentStatus;
  description: string | null;
  donation_at: string;
  created_at: string;
}

export interface IDonCreer {
  donator: string;
  email?: string | null;
  phone?: string | null;
  donation_type?: IDonType;
  amount: number;
  project: string;
  paymethod?: IDonPaymethod | null;
  paytransaction?: string | null;
  payment_status?: IDonPaymentStatus;
  description?: string | null;
  donation_at: string;
}

/** Don créé depuis le site public avec paiement à la paroisse. */
export interface IDonPublicCreer {
  donator: string;
  email?: string | null;
  phone?: string | null;
  amount: number;
  project: string;
  description?: string | null;
}

export interface IDonModifier extends Partial<IDonCreer> {}
