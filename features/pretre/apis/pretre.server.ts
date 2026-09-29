import type { IPretre } from "../types/pretre.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const pretreServerAPI = {
  async obtenirTous(): Promise<IPretre[]> {
    const res = await fetchPublicOrNull<{ data: IPretre[] }>("/priests");

    return res?.data ?? [];
  },
};
