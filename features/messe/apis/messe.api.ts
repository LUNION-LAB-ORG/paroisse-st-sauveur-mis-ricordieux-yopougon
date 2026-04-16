import { apiClient } from "@/lib/api.client";
import type { IPaginatedResponse } from "@/types/api.type";
import type { IMesse, IMesseCreer, IMesseModifier } from "../types/messe.type";

export const messeAPI = {
  obtenirTous(params?: Record<string, unknown>): Promise<IPaginatedResponse<IMesse>> {
    return apiClient.request({
      endpoint: `/messes`,
      method: "GET",
      searchParams: params,
      service: "private",
    });
  },
  ajouter(data: IMesseCreer): Promise<IMesse> {
    return apiClient.request({
      endpoint: `/messes`,
      method: "POST",
      data,
      service: "public",
    });
  },
  modifier(id: string, data: IMesseModifier): Promise<IMesse> {
    return apiClient.request({
      endpoint: `/messes/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },
  supprimer(id: string): Promise<void> {
    return apiClient.request({
      endpoint: `/messes/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
