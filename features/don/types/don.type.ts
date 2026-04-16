export type IDonPaymethod = "wave" | "especes" | "cheque" | "virement";

export interface IDon {
  id: number;
  donator: string;
  amount: number;
  project: string;
  paymethod: IDonPaymethod;
  paytransaction: string | null;
  description: string | null;
  donation_at: string;
  created_at: string;
}

export interface IDonCreer {
  donator: string;
  amount: number;
  project: string;
  paymethod: IDonPaymethod;
  paytransaction?: string | null;
  description?: string | null;
  donation_at: string;
}

export interface IDonModifier extends Partial<IDonCreer> {}
