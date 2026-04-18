import { apiClient } from "@/lib/api.client";
import type {
  IProgrammation,
  IProgrammationCreer,
  IProgrammationModifier,
} from "../types/programmation.type";

export const programmationAPI = {
  obtenirTous(params?: Record<string, string>): Promise<{ data: IProgrammation[] }> {
    return apiClient.request({
      endpoint: "/programmations",
      method: "GET",
      searchParams: params,
      service: "public",
    });
  },

  obtenirUn(id: number | string): Promise<{ data: IProgrammation }> {
    return apiClient.request({
      endpoint: `/programmations/${id}`,
      method: "GET",
      service: "public",
    });
  },

  async ajouter(data: FormData | IProgrammationCreer): Promise<{ data: IProgrammation }> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await apiClient.request<{ data: IProgrammation } | IProgrammation>({
      endpoint: "/programmations",
      method: "POST",
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    return (res as { data?: IProgrammation })?.data
      ? (res as { data: IProgrammation })
      : { data: res as IProgrammation };
  },

  async modifier(
    id: number | string,
    data: FormData | IProgrammationModifier,
  ): Promise<{ data: IProgrammation }> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const method = isForm ? "POST" : "PUT";
    const res = await apiClient.request<{ data: IProgrammation } | IProgrammation>({
      endpoint: `/programmations/${id}`,
      method,
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    return (res as { data?: IProgrammation })?.data
      ? (res as { data: IProgrammation })
      : { data: res as IProgrammation };
  },

  supprimer(id: number | string): Promise<void> {
    return apiClient.request({
      endpoint: `/programmations/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
