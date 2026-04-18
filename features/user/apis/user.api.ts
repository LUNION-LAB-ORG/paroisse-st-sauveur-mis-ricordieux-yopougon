import { apiClient } from "@/lib/api.client";
import type { IUser, IUserCreer, IUserModifier } from "../types/user.type";

export const userAPI = {
  obtenirTous(params?: Record<string, string>): Promise<{ data: IUser[] }> {
    return apiClient.request({
      endpoint: "/users",
      method: "GET",
      searchParams: params,
      service: "private",
    });
  },

  obtenirUn(id: number | string): Promise<{ data: IUser }> {
    return apiClient.request({
      endpoint: `/users/${id}`,
      method: "GET",
      service: "private",
    });
  },

  obtenirMoi(): Promise<{ data: IUser }> {
    return apiClient.request({
      endpoint: "/me",
      method: "GET",
      service: "private",
    });
  },

  async modifierMoi(data: FormData | IUserModifier): Promise<{ data: IUser }> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    if (isForm) {
      // POST avec _method=PUT (workaround Laravel multipart)
      (data as FormData).set("_method", "PUT");
      return apiClient.request({
        endpoint: "/me",
        method: "POST",
        data,
        service: "private",
        config: { headers: { "Content-Type": "multipart/form-data" } },
      });
    }
    return apiClient.request({
      endpoint: "/me",
      method: "POST",
      data: { ...(data as IUserModifier), _method: "PUT" },
      service: "private",
    });
  },

  async ajouter(data: FormData | IUserCreer): Promise<{ data: IUser }> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await apiClient.request<{ data: IUser } | IUser>({
      endpoint: "/users",
      method: "POST",
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    return (res as { data?: IUser })?.data
      ? (res as { data: IUser })
      : { data: res as IUser };
  },

  async modifier(id: number | string, data: FormData | IUserModifier): Promise<{ data: IUser }> {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    const method = isForm ? "POST" : "PUT";
    const res = await apiClient.request<{ data: IUser } | IUser>({
      endpoint: `/users/${id}`,
      method,
      data,
      service: "private",
      config: isForm ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    });
    return (res as { data?: IUser })?.data
      ? (res as { data: IUser })
      : { data: res as IUser };
  },

  supprimer(id: number | string): Promise<void> {
    return apiClient.request({
      endpoint: `/users/${id}`,
      method: "DELETE",
      service: "private",
    });
  },
};
