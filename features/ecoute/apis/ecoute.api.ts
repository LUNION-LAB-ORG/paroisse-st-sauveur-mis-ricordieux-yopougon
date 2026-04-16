import { apiClient } from "@/lib/api.client";
import type {
  IEcoute,
  IEcouteCreer,
  IEcouteModifier,
  IEcouteListeReponse,
  IEcouteReponse,
} from "../types/ecoute.type";

export const ecouteAPI = {
  ajouter(data: IEcouteCreer): Promise<IEcouteReponse> {
    return apiClient.request({
      endpoint: "/ecoute",
      method: "POST",
      data,
      service: "public",
    });
  },

  obtenirTous(params?: Record<string, string>): Promise<IEcouteListeReponse> {
    return apiClient.request({
      endpoint: "/ecoute",
      method: "GET",
      searchParams: params,
      service: "private",
    });
  },

  modifier(id: number, data: IEcouteModifier): Promise<IEcouteReponse> {
    return apiClient.request({
      endpoint: `/ecoute/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number): Promise<IEcouteReponse> {
    return apiClient.request({
      endpoint: `/ecoute/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
