import { apiClient } from "@/lib/api.client";
import type { INotification } from "../types/notification.type";

export const notificationAPI = {
  obtenirTous(params?: Record<string, string>): Promise<{ data: INotification[] }> {
    return apiClient.request({
      endpoint: "/notifications",
      method: "GET",
      searchParams: params,
      service: "private",
    });
  },

  nombreNonLues(): Promise<{ count: number }> {
    return apiClient.request({
      endpoint: "/notifications/unread-count",
      method: "GET",
      service: "private",
    });
  },

  marquerLue(id: number): Promise<{ data: INotification }> {
    return apiClient.request({
      endpoint: `/notifications/${id}/read`,
      method: "POST",
      service: "private",
    });
  },

  marquerToutLu(): Promise<{ status: string }> {
    return apiClient.request({
      endpoint: "/notifications/mark-all-read",
      method: "POST",
      service: "private",
    });
  },

  supprimer(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/notifications/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
