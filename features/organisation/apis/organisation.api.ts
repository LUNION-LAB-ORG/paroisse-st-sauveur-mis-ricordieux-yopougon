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

  obtenirParId(id: number | string): Promise<{ data: IOrganisation }> {
    return apiClient.request({
      endpoint: `/organisations/${id}`,
      method: "GET",
      service: "private",
    });
  },

  modifier(
    id: number | string,
    data: Partial<IOrganisationCreer> & { request_status?: "pending" | "accepted" | "canceled" },
  ): Promise<{ data: IOrganisation }> {
    return apiClient.request({
      endpoint: `/organisations/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  supprimer(id: number | string): Promise<void> {
    return apiClient.request({
      endpoint: `/organisations/${id}`,
      method: "DELETE",
      service: "private",
    });
  },

  convertToEvent(id: number | string): Promise<{ event: { data: unknown }; organisation: { data: unknown } }> {
    return apiClient.request({
      endpoint: `/organisations/${id}/convert-to-event`,
      method: "POST",
      service: "private",
    });
  },
};
