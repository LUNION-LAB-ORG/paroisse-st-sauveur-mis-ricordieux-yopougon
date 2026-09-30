import type {
  ICreneau,
  ICreneauSaisie,
  IException,
  IExceptionSaisie,
} from "../types/horaire-admin.type";

import { apiClient } from "@/lib/api.client";

/** Semaine type (`/time-slots`) et exceptions datées (`/schedule-exceptions`). */
export const horaireAPI = {
  creneaux(): Promise<{ data: ICreneau[] }> {
    return apiClient.request({
      endpoint: "/time-slots",
      method: "GET",
      searchParams: { per_page: "500" },
      service: "private",
    });
  },

  ajouterCreneau(data: ICreneauSaisie): Promise<{ data: ICreneau }> {
    return apiClient.request({
      endpoint: "/time-slots",
      method: "POST",
      data,
      service: "private",
    });
  },

  modifierCreneau(
    id: number,
    data: Partial<ICreneauSaisie>,
  ): Promise<{ data: ICreneau }> {
    return apiClient.request({
      endpoint: `/time-slots/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimerCreneau(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/time-slots/${id}`,
      method: "DELETE",
      service: "private",
    });
  },

  exceptions(from: string): Promise<{ data: IException[] }> {
    return apiClient.request({
      endpoint: "/schedule-exceptions",
      method: "GET",
      searchParams: { from },
      service: "private",
    });
  },

  ajouterException(data: IExceptionSaisie): Promise<{ data: IException }> {
    return apiClient.request({
      endpoint: "/schedule-exceptions",
      method: "POST",
      data,
      service: "private",
    });
  },

  modifierException(
    id: number,
    data: IExceptionSaisie,
  ): Promise<{ data: IException }> {
    return apiClient.request({
      endpoint: `/schedule-exceptions/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimerException(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/schedule-exceptions/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
