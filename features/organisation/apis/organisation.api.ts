import { apiClient } from "@/lib/api.client";
import type {
  IOrganisation,
  IOrganisationCreer,
} from "../types/organisation.type";

export const organisationAPI = {
  ajouter(data: IOrganisationCreer): Promise<{ data: IOrganisation }> {
    return apiClient.request({
      endpoint: "/organisations",
      method: "POST",
      data,
      service: "public",
    });
  },

  obtenirTous(
    params?: Record<string, string>,
  ): Promise<{ data: IOrganisation[] }> {
    return apiClient.request({
      endpoint: "/organisations",
      method: "GET",
      searchParams: params,
      service: "private",
    });
  },
};
