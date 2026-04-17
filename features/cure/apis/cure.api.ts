import { apiClient } from "@/lib/api.client";
import type { IPaginatedResponse } from "@/types/api.type";
import type { ICure } from "../types/cure.type";

export const cureAPI = {
  obtenirTous(params?: Record<string, unknown>): Promise<IPaginatedResponse<ICure>> {
    return apiClient.request({
      endpoint: `/pastors`,
      method: "GET",
      searchParams: params,
      service: "public",
    });
  },
  async ajouter(data: FormData | Record<string, unknown>): Promise<ICure> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await apiClient.request({
      endpoint: `/pastors`,
      method: "POST",
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    return ((res as any)?.data ?? res) as ICure;
  },
  async modifier(id: string, data: FormData | Record<string, unknown>): Promise<ICure> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    // Laravel ne parse pas le multipart sur PUT : on passe en POST avec _method=PUT
    const method = isForm ? "POST" : "PUT";
    const res = await apiClient.request({
      endpoint: `/pastors/${id}`,
      method,
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    return ((res as any)?.data ?? res) as ICure;
  },
  supprimer(id: string): Promise<void> {
    return apiClient.request({
      endpoint: `/pastors/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
