export type IOrganisationMembreParoisse = "yes" | "no";
export type IOrganisationStatutDemande = "pending" | "accepted" | "canceled";

export interface IOrganisation {
  id?: number;
  title?: string | null;
  location_at?: string | null;
  image?: string | null;
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
  is_paid?: boolean;
  price?: number | null;
  max_participants?: number | null;
  registration_deadline?: string | null;
  converted_event_id?: number | null;
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
