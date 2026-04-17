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
  async obtenirParId(id: string): Promise<IEvenement> {
    const res = await apiClient.request<{ data: IEvenement }>({
      endpoint: `/events/${id}`,
      method: "GET",
      service: "public",
    });
    // Le backend retourne { data: ... } via EventResource, on extrait
    return (res as any)?.data ?? (res as any as IEvenement);
  },
  async ajouter(data: FormData | Record<string, unknown>): Promise<IEvenement> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await apiClient.request({
      endpoint: `/events`,
      method: "POST",
      data,
      service: "private",
      config: isForm
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
    });
    return (res as any)?.data ?? (res as any);
  },
  async modifier(id: string, data: FormData | Record<string, unknown>): Promise<IEvenement> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const method = isForm ? "POST" : "PUT";
    const res = await apiClient.request({
      endpoint: `/events/${id}`,
      method,
      data,
      service: "private",
      config: isForm
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
    });
    return (res as any)?.data ?? (res as any);
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
