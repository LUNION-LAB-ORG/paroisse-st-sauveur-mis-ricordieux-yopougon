import { apiClient } from "@/lib/api.client";
import type {
  IMediation,
  IMediationCreer,
  IMediationModifier,
} from "../types/mediation.type";

export const mediationAPI = {
  ajouter(data: IMediationCreer): Promise<{ data: IMediation }> {
    return apiClient.request({
      endpoint: "/mediations",
      method: "POST",
      data,
      service: "public",
    });
  },

  obtenirTous(
    params?: Record<string, string>,
  ): Promise<{ data: IMediation[] }> {
    return apiClient.request({
      endpoint: "/mediations",
      method: "GET",
      searchParams: params,
      service: "private",
    });
  },

  modifier(
    id: number,
    data: IMediationModifier,
  ): Promise<{ data: IMediation }> {
    return apiClient.request({
      endpoint: `/mediations/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number): Promise<{ data: IMediation }> {
    return apiClient.request({
      endpoint: `/mediations/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
