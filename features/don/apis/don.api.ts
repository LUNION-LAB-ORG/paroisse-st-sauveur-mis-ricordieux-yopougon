import { apiClient } from "@/lib/api.client";
import type {
  IDon,
  IDonCreer,
  IDonModifier,
} from "../types/don.type";

export const donAPI = {
  ajouter(data: IDonCreer): Promise<{ data: IDon }> {
    return apiClient.request({
      endpoint: "/donations",
      method: "POST",
      data,
      service: "public",
    });
  },

  obtenirTous(params?: Record<string, string>): Promise<{ data: IDon[] }> {
    return apiClient.request({
      endpoint: "/donations",
      method: "GET",
      searchParams: params,
      service: "private",
    });
  },

  modifier(id: number, data: IDonModifier): Promise<{ data: IDon }> {
    return apiClient.request({
      endpoint: `/dons/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number): Promise<{ data: IDon }> {
    return apiClient.request({
      endpoint: `/dons/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
