export type IDonModePaiement = "carte" | "virement" | "especes" | "cheque" | "mobile_money";

export type IDonStatut = "en_attente" | "confirme" | "annule" | "rembourse";

export interface IDon {
  id: number;
  montant: number;
  projet: string;
  donateur: string;
  modePaiement: IDonModePaiement;
  statut: IDonStatut;
  created_at: string;
}

export interface IDonCreer {
  montant: number;
  projet: string;
  donateur: string;
  modePaiement: IDonModePaiement;
  statut?: IDonStatut;
}

export interface IDonModifier extends Partial<IDonCreer> {}
