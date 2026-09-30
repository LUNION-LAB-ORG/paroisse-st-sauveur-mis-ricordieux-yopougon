import type { IConseil, IConseilEnregistrer } from "../types/conseil.type";

import { apiClient } from "@/lib/api.client";

/** Conseils de la paroisse côté back-office (tous statuts, téléphones inclus). */
export const conseilAPI = {
  listerAdmin(): Promise<{ data: IConseil[] }> {
    return apiClient.request({
      endpoint: "/councils",
      method: "GET",
      searchParams: { all: "1" },
      service: "private",
    });
  },

  ajouter(data: IConseilEnregistrer): Promise<{ data: IConseil }> {
    return apiClient.request({
      endpoint: "/councils",
      method: "POST",
      data,
      service: "private",
    });
  },

  modifier(id: number, data: IConseilEnregistrer): Promise<{ data: IConseil }> {
    return apiClient.request({
      endpoint: `/councils/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number): Promise<unknown> {
    return apiClient.request({
      endpoint: `/councils/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
