export type IEcouteStatutDemande = "pending" | "accepted" | "canceled";

export interface IEcoute {
  id?: number;
  type?: string;
  fullname: string;
  phone?: string;
  availability?: string;
  message: string;
  request_status?: IEcouteStatutDemande;
  created_at?: string;
}

export interface IEcouteCreer {
  type?: string;
  fullname: string;
  phone?: string;
  availability?: string;
  message: string;
  request_status?: IEcouteStatutDemande;
}

export interface IEcouteModifier extends Partial<IEcouteCreer> {}

export interface IEcouteReponse {
  success: boolean;
  data?: IEcoute;
  error?: string;
}

export interface IEcouteListeReponse {
  success: boolean;
  data?: IEcoute[];
  error?: string;
}
