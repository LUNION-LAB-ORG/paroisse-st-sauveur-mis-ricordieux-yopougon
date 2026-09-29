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
};
