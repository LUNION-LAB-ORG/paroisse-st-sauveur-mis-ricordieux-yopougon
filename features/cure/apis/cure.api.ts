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
  ajouter(data: FormData | Record<string, unknown>): Promise<ICure> {
    return apiClient.request({
      endpoint: `/pastors`,
      method: "POST",
      data,
      service: "private",
    });
  },
  modifier(id: string, data: FormData | Record<string, unknown>): Promise<ICure> {
    return apiClient.request({
      endpoint: `/pastors/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },
  supprimer(id: string): Promise<void> {
    return apiClient.request({
      endpoint: `/pastors/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
