import type { IJourHoraire } from "../types/horaire.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const horaireServerAPI = {
  async obtenirSemaine(start?: string): Promise<IJourHoraire[]> {
    const res = await fetchPublicOrNull<{ data: IJourHoraire[] }>(
      "/schedule/week",
      { start },
    );

    return res?.data ?? [];
  },
};
