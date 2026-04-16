export type IMediationStatut = "en_attente" | "en_cours" | "resolue" | "annulee";

export type IMediationType = "familiale" | "conjugale" | "communautaire" | "autre";

export interface IMediation {
  id: number;
  type: IMediationType;
  demandeur: string;
  email?: string;
  telephone: string;
  description: string;
  statut: IMediationStatut;
  dateDisponibilite?: string;
  created_at: string;
}

export interface IMediationCreer {
  type: IMediationType;
  demandeur: string;
  email?: string;
  telephone: string;
  description: string;
  statut?: IMediationStatut;
  dateDisponibilite?: string;
}

export interface IMediationModifier extends Partial<IMediationCreer> {}
