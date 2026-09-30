import type {
  IHomelieAdmin,
  IHomelieSaisie,
  IJourLiturgique,
  IResultatImport,
} from "../types/liturgie-admin.type";
import type { IPretre } from "@/features/pretre/types/pretre.type";

import { apiClient } from "@/lib/api.client";

/** Liturgie (AELF) et homélies — écran « Parole du jour et homélie ». */
export const liturgieAPI = {
  jours(from: string, to: string): Promise<{ data: IJourLiturgique[] }> {
    return apiClient.request({
      endpoint: "/liturgy/days",
      method: "GET",
      searchParams: { from, to },
      service: "private",
    });
  },

  importer(date: string, days = 7): Promise<{ data: IResultatImport }> {
    return apiClient.request({
      endpoint: "/liturgy/import",
      method: "POST",
      data: { date, days },
      service: "private",
    });
  },

  surcharger(
    date: string,
    data: { feast_override: string | null; color_override: string | null },
  ): Promise<{ data: IJourLiturgique }> {
    return apiClient.request({
      endpoint: `/liturgy/${date}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  homelies(): Promise<{ data: IHomelieAdmin[] }> {
    return apiClient.request({
      endpoint: "/homilies",
      method: "GET",
      searchParams: { all: "1" },
      service: "private",
    });
  },

  ajouterHomelie(data: IHomelieSaisie): Promise<{ data: IHomelieAdmin }> {
    return apiClient.request({
      endpoint: "/homilies",
      method: "POST",
      data,
      service: "private",
    });
  },

  modifierHomelie(
    id: number,
    data: Partial<IHomelieSaisie>,
  ): Promise<{ data: IHomelieAdmin }> {
    return apiClient.request({
      endpoint: `/homilies/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimerHomelie(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/homilies/${id}`,
      method: "DELETE",
      service: "private",
    });
  },

  /** Prêtres (tous statuts) pour le choix de l'auteur de l'homélie. */
  pretres(): Promise<{ data: IPretre[] }> {
    return apiClient.request({
      endpoint: "/priests",
      method: "GET",
      searchParams: { all: "1" },
      service: "private",
    });
  },

  envoyerAudio(id: number, fichier: File): Promise<{ data: IHomelieAdmin }> {
    const fd = new FormData();

    fd.append("audio", fichier);

    return apiClient.request({
      endpoint: `/homilies/${id}/audio`,
      method: "POST",
      data: fd,
      service: "private",
      config: {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      },
    });
  },
};
