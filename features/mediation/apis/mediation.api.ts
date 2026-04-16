import { apiClient } from "@/lib/api.client";
import type {
  IMediation,
  IMediationCreer,
  IMediationModifier,
} from "../types/mediation.type";

export const mediationAPI = {
  obtenirTous(
    params?: Record<string, string>,
  ): Promise<{ data: IMediation[] }> {
    return apiClient.request({
      endpoint: "/mediations",
      method: "GET",
      searchParams: params,
      service: "public",
    });
  },

  obtenirUn(id: number | string): Promise<{ data: IMediation }> {
    return apiClient.request({
      endpoint: `/mediations/${id}`,
      method: "GET",
      service: "public",
    });
  },

  ajouter(data: IMediationCreer): Promise<{ data: IMediation }> {
    return apiClient.request({
      endpoint: "/mediations",
      method: "POST",
      data,
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

  supprimer(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/mediations/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
