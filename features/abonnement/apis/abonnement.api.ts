import type { AbonnementDTO } from "../schemas/abonnement.schema";
import type { IAbonnement, IListeAbonnement } from "../types/abonnement.type";

import { apiClient } from "@/lib/api.client";

export const abonnementAPI = {
  abonner(
    data: AbonnementDTO & { lists?: IListeAbonnement[] },
  ): Promise<{ data: IAbonnement }> {
    return apiClient.request({
      endpoint: "/subscriptions",
      method: "POST",
      data,
      service: "public",
    });
  },
};
