import type { IConseil } from "../types/conseil.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const conseilServerAPI = {
  async obtenirTous(): Promise<IConseil[]> {
    const res = await fetchPublicOrNull<{ data: IConseil[] }>("/councils");

    return res?.data ?? [];
  },
};
