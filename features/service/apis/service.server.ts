import type { IService } from "../types/service.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const serviceServerAPI = {
  /** Mouvements et groupes publiés, dans l'ordre d'affichage choisi dans le back-office. */
  async obtenirMouvements(): Promise<IService[]> {
    const res = await fetchPublicOrNull<{ data: IService[] }>("/services", {
      per_page: 100,
      sort_by: "sort_order",
      sort_dir: "asc",
    });

    return res?.data ?? [];
  },

  /** Un mouvement publié (null si absent ou non publié). */
  async obtenir(id: string): Promise<IService | null> {
    if (!/^\d+$/.test(id)) return null;
    const res = await fetchPublicOrNull<{ data: IService }>(`/services/${id}`);
    const m = res?.data ?? null;

    return m && m.status === "published" ? m : null;
  },
};
