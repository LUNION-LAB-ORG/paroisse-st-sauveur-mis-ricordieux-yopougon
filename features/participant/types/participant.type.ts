export interface IParticipantEvenement {
  id: number;
  title: string;
  description: string;
  date_at: string;
  time_at: string;
  image: string;
  location_at: string;
  created_at: string;
}

export interface IParticipant {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  message: string;
  event: IParticipantEvenement;
  created_at: string;
}

export interface IParticipantCreer {
  fullname: string;
  email: string;
  phone: string;
  message: string;
  event_id: number;
}

export interface IParticipantModifier extends Partial<IParticipantCreer> {}

export interface IParticipantReponse {
  data: IParticipant;
}

export interface IParticipantListeReponse {
  data: IParticipant[];
}
