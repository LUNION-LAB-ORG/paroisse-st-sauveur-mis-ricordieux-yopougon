import type { IPhase, IProjetEglise } from "../types/projet-eglise.type";

import { apiClient } from "@/lib/api.client";

export interface IProjetEgliseModifier {
  title?: string;
  presentation?: string | null;
  goal_amount?: number;
  adjustment_amount?: number;
  phases?: IPhase[];
}

/** Projet « Nouvelle église » côté back-office (une seule fiche). */
export const projetEgliseAPI = {
  obtenir(): Promise<{ data: IProjetEglise }> {
    return apiClient.request({
      endpoint: "/church-project",
      method: "GET",
      service: "private",
    });
  },

  modifier(data: IProjetEgliseModifier): Promise<{ data: IProjetEglise }> {
    return apiClient.request({
      endpoint: "/church-project",
      method: "PUT",
      data,
      service: "private",
    });
  },

  ajouterPhoto(fichier: File): Promise<{ data: IProjetEglise }> {
    const fd = new FormData();

    fd.append("image", fichier);

    return apiClient.request({
      endpoint: "/church-project/gallery",
      method: "POST",
      data: fd,
      service: "private",
      config: { headers: { "Content-Type": "multipart/form-data" } },
    });
  },

  retirerPhoto(index: number): Promise<{ data: IProjetEglise }> {
    return apiClient.request({
      endpoint: `/church-project/gallery/${index}`,
      method: "DELETE",
      service: "private",
    });
  },
};
