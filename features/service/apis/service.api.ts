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
