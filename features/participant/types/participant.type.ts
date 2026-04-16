export interface IParticipant {
  id: number;
  fullname: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  event_id?: number;
  created_at: string;
}

export interface IParticipantCreer {
  fullname: string;
  email?: string;
  phone?: string;
  message?: string;
  event_id: number;
}

export interface IParticipantListeReponse {
  data: IParticipant[];
}

export interface IParticipantReponse {
  data: IParticipant;
}
