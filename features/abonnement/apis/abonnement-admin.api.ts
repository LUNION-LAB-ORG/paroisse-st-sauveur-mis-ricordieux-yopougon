import type {
  IAbonne,
  IStatsAbonnes,
  IStatutAbonne,
} from "../types/abonnement-admin.type";
import type { IPageLaravel } from "@/features/admin/utils/reponse-api";

import { apiClient } from "@/lib/api.client";

export const abonnementAdminAPI = {
  lister(params: {
    status: IStatutAbonne;
    phone?: string;
    page: number;
  }): Promise<IPageLaravel<IAbonne>> {
    const searchParams: Record<string, string> = {
      page: String(params.page),
      per_page: "20",
    };

    if (params.status) searchParams.status = params.status;
    if (params.phone) searchParams.phone = params.phone;

    return apiClient.request({
      endpoint: "/subscriptions",
      method: "GET",
      searchParams,
      service: "private",
    });
  },

  stats(): Promise<{ data: IStatsAbonnes }> {
    return apiClient.request({
      endpoint: "/subscriptions/stats",
      method: "GET",
      service: "private",
    });
  },
};
