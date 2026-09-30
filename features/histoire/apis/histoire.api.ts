import type { IJalon } from "../types/histoire.type";

import { adminAPI } from "@/features/admin/apis/admin.api";
import { apiClient } from "@/lib/api.client";

export type IJalonSaisie = Pick<IJalon, "year" | "title"> &
  Partial<Pick<IJalon, "sort_order" | "status">>;

/** Grandes dates de la paroisse (`/history-milestones`). */
export const histoireAPI = {
  jalons(): Promise<{ data: IJalon[] }> {
    return apiClient.request({
      endpoint: "/history-milestones",
      method: "GET",
      searchParams: { all: "1" },
      service: "private",
    });
  },

  ajouter(data: IJalonSaisie): Promise<{ data: IJalon }> {
    return apiClient.request({
      endpoint: "/history-milestones",
      method: "POST",
      data,
      service: "private",
    });
  },

  modifier(id: number, data: Partial<IJalonSaisie>): Promise<{ data: IJalon }> {
    return apiClient.request({
      endpoint: `/history-milestones/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/history-milestones/${id}`,
      method: "DELETE",
      service: "private",
    });
  },

  /** Ordre d'affichage : route commune, repli sur `sort_order` jalon par jalon. */
  async reordonner(ids: number[]): Promise<void> {
    try {
      await adminAPI.reordonner("history-milestones", ids);
    } catch (err) {
      const statut = (err as { status?: number })?.status;

      if (statut !== 404 && statut !== 405) throw err;
      for (let i = 0; i < ids.length; i++)
        await histoireAPI.modifier(ids[i], { sort_order: i });
    }
  },
};
