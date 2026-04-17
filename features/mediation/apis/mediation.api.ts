import { apiClient } from "@/lib/api.client";
import type {
  IMediation,
  IMediationCreer,
  IMediationModifier,
} from "../types/mediation.type";

export const mediationAPI = {
  obtenirTous(
    params?: Record<string, string>,
  ): Promise<{ data: IMediation[] }> {
    return apiClient.request({
      endpoint: "/mediations",
      method: "GET",
      searchParams: params,
      service: "public",
    });
  },

  obtenirUn(id: number | string): Promise<{ data: IMediation }> {
    return apiClient.request({
      endpoint: `/mediations/${id}`,
      method: "GET",
      service: "public",
    });
  },

  async ajouter(data: FormData | IMediationCreer): Promise<{ data: IMediation }> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await apiClient.request<{ data: IMediation } | IMediation>({
      endpoint: "/mediations",
      method: "POST",
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    const wrapped = (res as { data?: IMediation })?.data
      ? (res as { data: IMediation })
      : { data: res as IMediation };
    return wrapped;
  },

  async modifier(
    id: number,
    data: FormData | IMediationModifier,
  ): Promise<{ data: IMediation }> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    // Laravel ne parse pas multipart sur PUT → POST + _method=PUT
    const method = isForm ? "POST" : "PUT";
    const res = await apiClient.request<{ data: IMediation } | IMediation>({
      endpoint: `/mediations/${id}`,
      method,
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    const wrapped = (res as { data?: IMediation })?.data
      ? (res as { data: IMediation })
      : { data: res as IMediation };
    return wrapped;
  },

  supprimer(id: number): Promise<void> {
    return apiClient.request({
      endpoint: `/mediations/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
