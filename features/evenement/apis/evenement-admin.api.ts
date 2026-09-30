import type {
  IEvenementAdmin,
  IEvenementSaisie,
  IInscrit,
} from "../types/evenement-admin.type";

import { apiClient } from "@/lib/api.client";

const statut = (err: unknown) => (err as { status?: number })?.status;

/** Événements côté back-office (tous statuts). */
export const evenementAdminAPI = {
  liste(periode: "upcoming" | "past"): Promise<{ data: IEvenementAdmin[] }> {
    return apiClient.request({
      endpoint: "/events",
      method: "GET",
      searchParams: { all: "1", per_page: "100", [periode]: "1" },
      service: "private",
    });
  },

  ajouter(data: IEvenementSaisie): Promise<{ data: IEvenementAdmin }> {
    return apiClient.request({
      endpoint: "/events",
      method: "POST",
      data,
      service: "private",
    });
  },

  modifier(
    id: number,
    data: Partial<IEvenementSaisie>,
  ): Promise<{ data: IEvenementAdmin }> {
    return apiClient.request({
      endpoint: `/events/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  /** Affiche : multipart avec `_method=PUT`. */
  changerAffiche(id: number, image: File): Promise<{ data: IEvenementAdmin }> {
    const fd = new FormData();

    fd.append("_method", "PUT");
    fd.append("image", image);

    return apiClient.request({
      endpoint: `/events/${id}`,
      method: "POST",
      data: fd,
      service: "private",
      config: {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      },
    });
  },

  supprimer(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/events/${id}`,
      method: "DELETE",
      service: "private",
    });
  },

  /**
   * Inscrits : route du back-office, avec repli sur `/participants?event_id=`
   * tant que la route dédiée n'est pas déployée.
   */
  async inscrits(id: number): Promise<IInscrit[]> {
    try {
      const res: { data: IInscrit[] } = await apiClient.request({
        endpoint: `/events/${id}/participants`,
        method: "GET",
        service: "private",
      });

      return res.data ?? [];
    } catch (err) {
      if (statut(err) !== 404 && statut(err) !== 405) throw err;
      const res: { data: IInscrit[] } = await apiClient.request({
        endpoint: "/participants",
        method: "GET",
        searchParams: { event_id: String(id) },
        service: "private",
      });

      return res.data ?? [];
    }
  },
};
