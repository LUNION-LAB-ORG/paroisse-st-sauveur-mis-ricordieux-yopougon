import type {
  IRendezVous,
  IRendezVousModifier,
} from "../types/rendez-vous.type";
import type { IPageLaravel } from "@/features/admin/utils/reponse-api";

import { apiClient } from "@/lib/api.client";

export const rendezVousAPI = {
  lister(): Promise<IPageLaravel<IRendezVous>> {
    return apiClient.request({
      endpoint: "/listens",
      method: "GET",
      searchParams: { per_page: "100", sort_by: "id", sort_dir: "desc" },
      service: "private",
    });
  },

  modifier(
    id: number,
    data: IRendezVousModifier,
  ): Promise<{ data: IRendezVous }> {
    return apiClient.request({
      endpoint: `/listens/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },
};
