import type { IAnnonce } from "../types/annonce.type";

import { apiClient } from "@/lib/api.client";

export type IAnnonceSaisie = Pick<
  IAnnonce,
  | "category"
  | "title"
  | "content"
  | "contact"
  | "is_featured"
  | "visible_from"
  | "visible_until"
  | "status"
>;

/** Annonces (back-office) : tous statuts, jusqu'à 100 par page. */
export const annonceAPI = {
  obtenirToutes(): Promise<{ data: IAnnonce[] }> {
    return apiClient.request({
      endpoint: "/announcements",
      method: "GET",
      searchParams: { all: "1", per_page: "100" },
      service: "private",
    });
  },

  ajouter(data: IAnnonceSaisie): Promise<{ data: IAnnonce }> {
    return apiClient.request({
      endpoint: "/announcements",
      method: "POST",
      data,
      service: "private",
    });
  },

  modifier(
    id: number,
    data: Partial<IAnnonceSaisie>,
  ): Promise<{ data: IAnnonce }> {
    return apiClient.request({
      endpoint: `/announcements/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/announcements/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
