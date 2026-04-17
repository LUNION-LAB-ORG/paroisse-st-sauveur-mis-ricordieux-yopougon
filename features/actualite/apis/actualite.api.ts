import { apiClient } from "@/lib/api.client";
import type { IPaginatedResponse } from "@/types/api.type";
import type { IActualite, IActualiteCreer, IActualiteModifier } from "../types/actualite.type";

export const actualiteAPI = {
  obtenirTous(params?: Record<string, unknown>): Promise<IPaginatedResponse<IActualite>> {
    return apiClient.request({
      endpoint: `/news`,
      method: "GET",
      searchParams: params,
      service: "public",
    });
  },
  obtenirParId(id: string): Promise<{ data: IActualite }> {
    return apiClient.request({
      endpoint: `/news/${id}`,
      method: "GET",
      service: "public",
    });
  },
  async ajouter(data: FormData | IActualiteCreer): Promise<IActualite> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await apiClient.request({
      endpoint: `/news`,
      method: "POST",
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    return ((res as any)?.data ?? res) as IActualite;
  },
  async modifier(id: string, data: FormData | IActualiteModifier): Promise<IActualite> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    // Laravel ne parse pas le multipart sur PUT → POST avec _method=PUT
    const method = isForm ? "POST" : "PUT";
    const res = await apiClient.request({
      endpoint: `/news/${id}`,
      method,
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    return ((res as any)?.data ?? res) as IActualite;
  },
  supprimer(id: string): Promise<void> {
    return apiClient.request({
      endpoint: `/news/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
