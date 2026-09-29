import type {
  IDemandeMesseCreee,
  IDemandeMesseCreer,
  IDisponibilites,
} from "../types/demande-messe.type";

import { apiClient } from "@/lib/api.client";

export const demandeMesseAPI = {
  disponibilites(from: string, days = 14): Promise<{ data: IDisponibilites }> {
    return apiClient.request({
      endpoint: "/mass-requests/availability",
      method: "GET",
      searchParams: { from, days: String(days) },
      service: "public",
    });
  },

  creer(data: IDemandeMesseCreer): Promise<{ data: IDemandeMesseCreee }> {
    return apiClient.request({
      endpoint: "/mass-requests",
      method: "POST",
      data,
      service: "public",
    });
  },
};
