import { apiClient } from "@/lib/api.client";
import type { IService, IServiceCreer, IServiceModifier } from "../types/service.type";

export const serviceAPI = {
  obtenirTous(params?: Record<string, string>): Promise<{ data: IService[] }> {
    return apiClient.request({
      endpoint: "/services",
      method: "GET",
      searchParams: params,
      service: "public",
    });
  },

  obtenirUn(id: number | string): Promise<{ data: IService }> {
    return apiClient.request({
      endpoint: `/services/${id}`,
      method: "GET",
      service: "public",
    });
  },

  ajouter(data: IServiceCreer): Promise<{ data: IService }> {
    return apiClient.request({
      endpoint: "/services",
      method: "POST",
      data,
      service: "private",
    });
  },

  modifier(id: number | string, data: IServiceModifier): Promise<{ data: IService }> {
    return apiClient.request({
      endpoint: `/services/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number | string): Promise<void> {
    return apiClient.request({
      endpoint: `/services/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
