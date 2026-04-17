import { apiClient } from "@/lib/api.client";
import type { IPaginatedResponse } from "@/types/api.type";
import type { IEvenement, IInscriptionResponse } from "../types/evenement.type";

export const evenementAPI = {
  obtenirTous(params?: Record<string, unknown>): Promise<IPaginatedResponse<IEvenement>> {
    return apiClient.request({
      endpoint: `/events`,
      method: "GET",
      searchParams: params,
      service: "public",
    });
  },
  obtenirParId(id: string): Promise<IEvenement> {
    return apiClient.request({
      endpoint: `/events/${id}`,
      method: "GET",
      service: "public",
    });
  },
  ajouter(data: FormData | Record<string, unknown>): Promise<IEvenement> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    return apiClient.request({
      endpoint: `/events`,
      method: "POST",
      data,
      service: "private",
      config: isForm
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
    });
  },
  modifier(id: string, data: FormData | Record<string, unknown>): Promise<IEvenement> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    // Laravel + FormData + PUT : utiliser POST + _method=PUT (méthode override)
    const method = isForm ? "POST" : "PUT";
    return apiClient.request({
      endpoint: `/events/${id}`,
      method,
      data,
      service: "private",
      config: isForm
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
    });
  },
  supprimer(id: string): Promise<void> {
    return apiClient.request({
      endpoint: `/events/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
  inscrire(
    id: string,
    data: { fullname: string; phone?: string; email?: string; message?: string },
  ): Promise<IInscriptionResponse> {
    return apiClient.request({
      endpoint: `/events/${id}/register`,
      method: "POST",
      data,
      service: "public",
    });
  },
};
