import type { IEvenement } from "../types/evenement.type";

import { fetchPublic, fetchPublicOrNull } from "@/lib/api.public";

export const agendaServerAPI = {
  async obtenirAVenir(limite = 50): Promise<IEvenement[]> {
    const res = await fetchPublicOrNull<{ data: IEvenement[] }>("/events", {
      upcoming: 1,
      per_page: limite,
    });

    return res?.data ?? [];
  },

  async obtenirPasses(limite = 12): Promise<IEvenement[]> {
    const res = await fetchPublicOrNull<{ data: IEvenement[] }>("/events", {
      past: 1,
      per_page: limite,
    });

    return res?.data ?? [];
  },

  /** Par slug ou id ; null si introuvable (404). */
  async obtenir(idOuSlug: string): Promise<IEvenement | null> {
    try {
      const res = await fetchPublic<{ data: IEvenement }>(
        `/events/${encodeURIComponent(idOuSlug)}`,
      );

      return res.data;
    } catch {
      return null;
    }
  },
};
