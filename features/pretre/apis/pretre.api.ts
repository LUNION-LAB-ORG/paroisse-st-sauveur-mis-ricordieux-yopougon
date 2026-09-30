import type { IPretre } from "../types/pretre.type";

import { apiClient } from "@/lib/api.client";

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

/** Équipe presbytérale côté back-office (tous statuts avec `?all=1`). */
export const pretreAPI = {
  listerAdmin(): Promise<{ data: IPretre[] }> {
    return apiClient.request({
      endpoint: "/priests",
      method: "GET",
      searchParams: { all: "1" },
      service: "private",
    });
  },

  ajouter(data: FormData): Promise<{ data: IPretre }> {
    return apiClient.request({
      endpoint: "/priests",
      method: "POST",
      data,
      service: "private",
      config: MULTIPART,
    });
  },

  /** Multipart (photo) : POST + `_method=PUT` (Laravel). */
  modifier(id: number, data: FormData): Promise<{ data: IPretre }> {
    data.set("_method", "PUT");

    return apiClient.request({
      endpoint: `/priests/${id}`,
      method: "POST",
      data,
      service: "private",
      config: MULTIPART,
    });
  },

  changerStatut(
    id: number,
    status: IPretre["status"],
  ): Promise<{ data: IPretre }> {
    return apiClient.request({
      endpoint: `/priests/${id}`,
      method: "PUT",
      data: { status },
      service: "private",
    });
  },

  supprimer(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/priests/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
