import type { ILiturgie } from "../types/liturgie.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const liturgieServerAPI = {
  async obtenirDuJour(date?: string): Promise<ILiturgie | null> {
    const res = await fetchPublicOrNull<{ data: ILiturgie }>("/liturgy", {
      date,
    });

    return res?.data ?? null;
  },
};
