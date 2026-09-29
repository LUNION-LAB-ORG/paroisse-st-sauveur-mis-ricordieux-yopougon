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

  /** Admin : tous les statuts (brouillons et masqués compris), requête authentifiée. */
  obtenirTousAdmin(): Promise<{ data: IService[] }> {
    return apiClient.request({
      endpoint: "/services",
      method: "GET",
      searchParams: { all: "1", per_page: "100", sort_by: "sort_order", sort_dir: "asc" },
      service: "private",
    });
  },

  /** Admin : lecture d'un service quel que soit son statut. */
  obtenirUnAdmin(id: number | string): Promise<{ data: IService }> {
    return apiClient.request({
      endpoint: `/services/${id}`,
      method: "GET",
      searchParams: { all: "1" },
      service: "private",
    });
  },

  obtenirUn(id: number | string): Promise<{ data: IService }> {
    return apiClient.request({
      endpoint: `/services/${id}`,
      method: "GET",
      service: "public",
    });
  },

  async ajouter(data: FormData | IServiceCreer): Promise<{ data: IService }> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await apiClient.request<{ data: IService } | IService>({
      endpoint: "/services",
      method: "POST",
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    return (res as { data?: IService })?.data
      ? (res as { data: IService })
      : { data: res as IService };
  },

  async modifier(
    id: number | string,
    data: FormData | IServiceModifier,
  ): Promise<{ data: IService }> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const method = isForm ? "POST" : "PUT";
    const res = await apiClient.request<{ data: IService } | IService>({
      endpoint: `/services/${id}`,
      method,
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    return (res as { data?: IService })?.data
      ? (res as { data: IService })
      : { data: res as IService };
  },

  supprimer(id: number | string): Promise<void> {
    return apiClient.request({
      endpoint: `/services/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
