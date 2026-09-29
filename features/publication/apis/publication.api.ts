import type {
  ICommentaire,
  IPublicationsPage,
} from "../types/publication.type";

import { apiClient } from "@/lib/api.client";

export const publicationAPI = {
  obtenirPage(params: Record<string, string>): Promise<IPublicationsPage> {
    return apiClient.request({
      endpoint: "/publications",
      method: "GET",
      searchParams: params,
      service: "public",
    });
  },

  etatJaime(
    id: number,
    deviceId: string,
  ): Promise<{ data: { liked: boolean; likes_count: number } }> {
    return apiClient.request({
      endpoint: `/publications/${id}/like`,
      method: "GET",
      searchParams: { device_id: deviceId },
      service: "public",
    });
  },

  basculerJaime(
    id: number,
    deviceId: string,
  ): Promise<{ data: { liked: boolean; likes_count: number } }> {
    return apiClient.request({
      endpoint: `/publications/${id}/like`,
      method: "POST",
      data: { device_id: deviceId },
      service: "public",
    });
  },

  commenter(
    id: number,
    data: { author: string; content: string },
  ): Promise<{ data: ICommentaire }> {
    return apiClient.request({
      endpoint: `/publications/${id}/comments`,
      method: "POST",
      data,
      service: "public",
    });
  },

  aimerCommentaire(
    id: number,
    deviceId: string,
  ): Promise<{ data: { liked: boolean; likes_count: number } }> {
    return apiClient.request({
      endpoint: `/comments/${id}/like`,
      method: "POST",
      data: { device_id: deviceId },
      service: "public",
    });
  },
};
