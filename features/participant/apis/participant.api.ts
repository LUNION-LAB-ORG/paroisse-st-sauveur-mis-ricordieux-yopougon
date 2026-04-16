import { apiClient } from "@/lib/api.client";
import type {
  IParticipant,
  IParticipantCreer,
  IParticipantModifier,
  IParticipantReponse,
  IParticipantListeReponse,
} from "../types/participant.type";

export const participantAPI = {
  ajouter(data: IParticipantCreer): Promise<IParticipantReponse> {
    return apiClient.request({
      endpoint: "/participants",
      method: "POST",
      data,
      service: "public",
    });
  },

  obtenirTous(
    params?: Record<string, string>,
  ): Promise<IParticipantListeReponse> {
    return apiClient.request({
      endpoint: "/participants",
      method: "GET",
      searchParams: params,
      service: "private",
    });
  },

  obtenirParEvenement(
    eventId: number,
  ): Promise<IParticipantListeReponse> {
    return apiClient.request({
      endpoint: `/participants/event/${eventId}`,
      method: "GET",
      service: "public",
    });
  },

  modifier(id: number, data: IParticipantModifier): Promise<IParticipantReponse> {
    return apiClient.request({
      endpoint: `/participants/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number): Promise<IParticipantReponse> {
    return apiClient.request({
      endpoint: `/participants/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
