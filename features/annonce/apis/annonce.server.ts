import type { IAnnonce } from "../types/annonce.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const annonceServerAPI = {
  /** Annonce mise en avant sur l'accueil : la première à la une, sinon la plus récente. */
  async obtenirALaUne(): Promise<IAnnonce | null> {
    const res = await fetchPublicOrNull<{ data: IAnnonce[] }>(
      "/announcements",
      { per_page: 1 },
    );

    return res?.data?.[0] ?? null;
  },
};
