import { apiClient } from "@/lib/api.client";
import type { IParticipant, IParticipantCreer } from "../types/participant.type";

export const participantAPI = {
  obtenirTous(params?: Record<string, string>): Promise<{ data: IParticipant[] }> {
    return apiClient.request({
      endpoint: "/participants",
      method: "GET",
      searchParams: params,
      service: "private",
    });
  },

  obtenirParEvenement(eventId: number): Promise<{ data: IParticipant[] }> {
    return apiClient.request({
      endpoint: "/participants",
      method: "GET",
      searchParams: { event_id: String(eventId) },
      service: "private",
    });
  },

  ajouter(data: IParticipantCreer): Promise<{ data: IParticipant }> {
    return apiClient.request({
      endpoint: "/participants",
      method: "POST",
      data,
      service: "public",
    });
  },

  supprimer(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/participants/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
