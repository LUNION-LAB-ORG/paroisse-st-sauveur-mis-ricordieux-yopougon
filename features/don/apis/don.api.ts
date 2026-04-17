import { apiClient } from "@/lib/api.client";
import type {
  IDon,
  IDonCreer,
  IDonModifier,
} from "../types/don.type";

export const donAPI = {
  async ajouter(data: IDonCreer): Promise<{ data: IDon }> {
    const res = await apiClient.request<{ data: IDon }>({
      endpoint: "/donations",
      method: "POST",
      data,
      service: "private",
    });
    return res;
  },

  obtenirTous(params?: Record<string, string>): Promise<{ data: IDon[] }> {
    return apiClient.request({
      endpoint: "/donations",
      method: "GET",
      searchParams: params,
      service: "private",
    });
  },

  obtenirParId(id: number): Promise<{ data: IDon }> {
    return apiClient.request({
      endpoint: `/donations/${id}`,
      method: "GET",
      service: "private",
    });
  },

  modifier(id: number, data: IDonModifier): Promise<{ data: IDon }> {
    return apiClient.request({
      endpoint: `/donations/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/donations/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
