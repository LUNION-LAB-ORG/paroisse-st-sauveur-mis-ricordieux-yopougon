export type IDonPaymethod = "wave" | "especes" | "cheque" | "virement" | "orange_money" | "mtn" | "autre";
export type IDonType = "monetaire" | "nature";

export interface IDon {
  id: number;
  donator: string;
  donation_type?: IDonType;
  amount: number;
  project: string;
  paymethod: IDonPaymethod | null;
  paytransaction: string | null;
  description: string | null;
  donation_at: string;
  created_at: string;
}

export interface IDonCreer {
  donator: string;
  donation_type?: IDonType;
  amount: number;
  project: string;
  paymethod?: IDonPaymethod | null;
  paytransaction?: string | null;
  description?: string | null;
  donation_at: string;
}

export interface IDonModifier extends Partial<IDonCreer> {}
