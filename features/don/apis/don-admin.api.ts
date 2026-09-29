import type { IDon, IDonCreer } from "../types/don.type";
import type { IPageLaravel } from "@/features/admin/utils/reponse-api";

import { apiClient } from "@/lib/api.client";

export interface IParamsDons {
  status?: "succeeded" | "pending" | "failed";
  method?: string;
  project?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}

export type IDonAdmin = IDon & { display_name?: boolean };

export type IPageDons = IPageLaravel<IDonAdmin> & {
  meta?: IPageLaravel<IDonAdmin>["meta"] & { total_amount?: number };
};

export const donAdminAPI = {
  lister({
    page = 1,
    per_page = 20,
    ...filtres
  }: IParamsDons): Promise<IPageDons> {
    const searchParams: Record<string, string> = {
      page: String(page),
      per_page: String(per_page),
    };

    Object.entries(filtres).forEach(
      ([k, v]) => v && (searchParams[k] = String(v)),
    );

    return apiClient.request({
      endpoint: "/donations",
      method: "GET",
      searchParams,
      service: "private",
    });
  },

  saisir(
    data: IDonCreer & { display_name?: boolean },
  ): Promise<{ data: IDonAdmin }> {
    return apiClient.request({
      endpoint: "/donations",
      method: "POST",
      data,
      service: "private",
    });
  },

  modifier(id: number, data: Partial<IDonCreer>): Promise<{ data: IDonAdmin }> {
    return apiClient.request({
      endpoint: `/donations/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },
};
