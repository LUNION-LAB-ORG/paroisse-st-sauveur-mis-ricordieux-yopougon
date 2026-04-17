import { apiClient } from "@/lib/api.client";
import type { ISettingsGrouped, ISettingsMap } from "../types/setting.type";

export const settingAPI = {
  obtenirGroupes(): Promise<{ data: ISettingsGrouped }> {
    return apiClient.request({
      endpoint: "/settings",
      method: "GET",
      service: "public",
    });
  },

  obtenirMap(): Promise<{ data: ISettingsMap }> {
    return apiClient.request({
      endpoint: "/settings/map",
      method: "GET",
      service: "public",
    });
  },

  modifier(
    settings: { key: string; value: string | null }[],
  ): Promise<{ status: string; message: string; data: ISettingsMap }> {
    return apiClient.request({
      endpoint: "/settings",
      method: "PUT",
      data: { settings },
      service: "private",
    });
  },

  async uploadImage(key: string, file: File): Promise<{ status: string; data: { key: string; value: string } }> {
    const fd = new FormData();
    fd.append("key", key);
    fd.append("image", file);
    return apiClient.request({
      endpoint: "/settings/upload-image",
      method: "POST",
      data: fd,
      service: "private",
      config: { headers: { "Content-Type": "multipart/form-data" } },
    });
  },
};
