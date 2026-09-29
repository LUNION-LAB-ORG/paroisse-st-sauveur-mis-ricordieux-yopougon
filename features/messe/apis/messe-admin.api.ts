import type {
  ICreneauCelebrant,
  IDemandeMesseAdmin,
  IFiltreMesses,
  ISaisieMesseSecretariat,
  IStatutDemandeMesse,
  IStatutPaiementMesse,
} from "../types/messe-admin.type";
import type { IPageLaravel } from "@/features/admin/utils/reponse-api";

import { apiClient } from "@/lib/api.client";

export interface IParamsMesses {
  status: IFiltreMesses;
  q?: string;
  date?: string;
  page?: number;
}

export const messeAdminAPI = {
  lister({
    status,
    q,
    date,
    page = 1,
  }: IParamsMesses): Promise<IPageLaravel<IDemandeMesseAdmin>> {
    const searchParams: Record<string, string> = {
      status,
      page: String(page),
      per_page: "20",
    };

    if (q) searchParams.q = q;
    if (date) searchParams.date = date;

    return apiClient.request({
      endpoint: "/messes",
      method: "GET",
      searchParams,
      service: "private",
    });
  },

  modifier(
    id: number,
    data: {
      payment_status?: IStatutPaiementMesse;
      request_status?: IStatutDemandeMesse;
    },
  ): Promise<{ data: IDemandeMesseAdmin }> {
    return apiClient.request({
      endpoint: `/messes/${id}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  /** Déplacer une messe programmée (contrôle de capacité côté serveur). */
  deplacer(
    scheduleId: number,
    data: { date: string; time_slot_id: number },
  ): Promise<unknown> {
    return apiClient.request({
      endpoint: `/mass-schedules/${scheduleId}`,
      method: "PUT",
      data,
      service: "private",
    });
  },

  saisir(
    data: ISaisieMesseSecretariat,
  ): Promise<{ data: { number: string } & Record<string, unknown> }> {
    return apiClient.request({
      endpoint: "/admin/mass-requests",
      method: "POST",
      data,
      service: "private",
    });
  },

  listeCelebrant(date: string): Promise<{ data: ICreneauCelebrant[] }> {
    return apiClient.request({
      endpoint: "/mass-schedules",
      method: "GET",
      searchParams: { date },
      service: "private",
    });
  },
};
