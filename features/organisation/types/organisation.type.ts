export type IOrganisationMembreParoisse = "yes" | "no";
export type IOrganisationStatutDemande = "pending" | "accepted" | "canceled";

export interface IOrganisation {
  id?: number;
  isParishMember: IOrganisationMembreParoisse;
  movement: string;
  email: string;
  eventType: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  estimatedParticipants?: string;
  request_status?: IOrganisationStatutDemande;
  created_at?: string;
}

export interface IOrganisationCreer {
  isParishMember: IOrganisationMembreParoisse;
  movement: string;
  email: string;
  eventType: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  estimatedParticipants?: string;
}

export interface IOrganisationModifier extends Partial<IOrganisationCreer> {}
