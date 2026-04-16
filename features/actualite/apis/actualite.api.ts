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
  ajouter(data: FormData | IActualiteCreer): Promise<IActualite> {
    return apiClient.request({
      endpoint: `/news`,
      method: "POST",
      data,
      service: "private",
    });
  },
  modifier(id: string, data: FormData | IActualiteModifier): Promise<IActualite> {
    return apiClient.request({
      endpoint: `/news/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },
  supprimer(id: string): Promise<void> {
    return apiClient.request({
      endpoint: `/news/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
