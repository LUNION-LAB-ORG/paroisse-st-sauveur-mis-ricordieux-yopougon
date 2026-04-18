import { apiClient } from "@/lib/api.client";
import type {
  ISlotOccurrence,
  ITimeSlot,
  ITimeSlotCreer,
  ITimeSlotModifier,
  ITimeSlotType,
} from "../types/time-slot.type";

export const timeSlotAPI = {
  /** Liste admin (paginée) — filtres par type / weekday */
  obtenirTous(params?: Record<string, string>): Promise<{ data: ITimeSlot[] }> {
    return apiClient.request({
      endpoint: "/time-slots",
      method: "GET",
      searchParams: params,
      service: "private",
    });
  },

  /** Liste publique des prochaines occurrences disponibles */
  obtenirDisponibles(type: ITimeSlotType, weeks = 6): Promise<{ data: ISlotOccurrence[] }> {
    return apiClient.request({
      endpoint: "/time-slots/available",
      method: "GET",
      searchParams: { type, weeks: String(weeks) },
      service: "public",
    });
  },

  ajouter(data: ITimeSlotCreer): Promise<{ data: ITimeSlot }> {
    return apiClient.request({
      endpoint: "/time-slots",
      method: "POST",
      data,
      service: "private",
    });
  },

  modifier(id: number, data: ITimeSlotModifier): Promise<{ data: ITimeSlot }> {
    return apiClient.request({
      endpoint: `/time-slots/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/time-slots/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
