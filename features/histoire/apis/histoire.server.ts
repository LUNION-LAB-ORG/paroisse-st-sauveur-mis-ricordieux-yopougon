import type { IJalon } from "../types/histoire.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const histoireServerAPI = {
  async obtenirJalons(): Promise<IJalon[]> {
    const res = await fetchPublicOrNull<{ data: IJalon[] }>(
      "/history-milestones",
    );

    return res?.data ?? [];
  },
};
