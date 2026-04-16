import { apiClient } from "@/lib/api.client";
import type { IConnexionPayload, IConnexionResponse, IProfilResponse } from "../types/authentification.type";

export const authentificationAPI = {
  connexion(data: IConnexionPayload): Promise<IConnexionResponse> {
    return apiClient.request({
      endpoint: `/auth/login`,
      method: "POST",
      data,
      service: "public",
    });
  },
  profil(): Promise<IProfilResponse> {
    return apiClient.request({
      endpoint: `/auth/profile`,
      method: "GET",
      service: "private",
    });
  },
};
