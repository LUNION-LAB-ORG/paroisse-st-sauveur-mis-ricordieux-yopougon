import type {
  IPublication,
  IPublicationsPage,
  IPublicationType,
} from "../types/publication.type";

import { apiClient } from "@/lib/api.client";

/** Publication vue du back-office (options d'interaction comprises). */
export interface IPublicationAdmin extends IPublication {
  allow_comments?: boolean;
  show_likes?: boolean;
}

export interface IPublicationSaisie {
  type: IPublicationType;
  format: string;
  category: string | null;
  title: string;
  lead: string | null;
  body: string | null;
  quote: string | null;
  video_url: string | null;
  video_duration: string | null;
  is_featured: boolean;
  allow_comments: boolean;
  show_likes: boolean;
  published_at: string | null;
  status: "draft" | "published" | "hidden";
}

/** Commentaire vu de la modération. */
export interface ICommentaireAdmin {
  id: number;
  author: string;
  initial: string;
  content: string;
  reply: string | null;
  replied_at: string | null;
  likes_count: number;
  created_at: string;
  status: "pending" | "published" | "rejected";
  publication_id?: number;
  publication?: { id: number; slug: string; title: string } | null;
}

export interface IPageCommentaires {
  data: ICommentaireAdmin[];
  meta?: { total: number; current_page: number; last_page: number };
}

const multipart = {
  headers: { "Content-Type": "multipart/form-data" },
  timeout: 60000,
};

export const publicationAdminAPI = {
  /** Toutes les publications (tous statuts), pages de 50 réunies. */
  async toutes(): Promise<IPublicationAdmin[]> {
    const res: IPublicationAdmin[] = [];

    for (let page = 1; page <= 20; page++) {
      const r: IPublicationsPage = await apiClient.request({
        endpoint: "/publications",
        method: "GET",
        searchParams: { all: "1", per_page: "50", page: String(page) },
        service: "private",
      });

      res.push(...((r.data ?? []) as IPublicationAdmin[]));
      if (!r.meta || page >= r.meta.last_page) break;
    }

    return res;
  },

  async obtenir(id: number): Promise<IPublicationAdmin> {
    const r: { data: IPublicationAdmin } = await apiClient.request({
      endpoint: `/publications/${id}`,
      method: "GET",
      searchParams: { all: "1" },
      service: "private",
    });

    return r.data;
  },

  ajouter(data: IPublicationSaisie): Promise<{ data: IPublicationAdmin }> {
    return apiClient.request({
      endpoint: "/publications",
      method: "POST",
      data,
      service: "private",
    });
  },

  modifier(
    id: number,
    data: Partial<IPublicationSaisie>,
  ): Promise<{ data: IPublicationAdmin }> {
    return apiClient.request({
      endpoint: `/publications/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/publications/${id}`,
      method: "DELETE",
      service: "private",
    });
  },

  ajouterPhoto(id: number, image: File): Promise<{ data: IPublicationAdmin }> {
    const fd = new FormData();

    fd.append("image", image);

    return apiClient.request({
      endpoint: `/publications/${id}/gallery`,
      method: "POST",
      data: fd,
      service: "private",
      config: multipart,
    });
  },

  retirerPhoto(
    id: number,
    index: number,
  ): Promise<{ data: IPublicationAdmin }> {
    return apiClient.request({
      endpoint: `/publications/${id}/gallery/${index}`,
      method: "DELETE",
      service: "private",
    });
  },

  commentaires(
    status: ICommentaireAdmin["status"],
    perPage = 100,
  ): Promise<IPageCommentaires> {
    return apiClient.request({
      endpoint: "/comments",
      method: "GET",
      searchParams: { status, per_page: String(perPage) },
      service: "private",
    });
  },

  modifierCommentaire(
    id: number,
    data: { status?: ICommentaireAdmin["status"]; reply?: string | null },
  ): Promise<{ data: ICommentaireAdmin }> {
    return apiClient.request({
      endpoint: `/comments/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimerCommentaire(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/comments/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
