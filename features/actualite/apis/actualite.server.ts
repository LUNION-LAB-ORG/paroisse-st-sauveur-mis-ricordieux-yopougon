import type { IActualite } from "../types/actualite.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const actualiteServerAPI = {
  async obtenirRecentes(limite = 3): Promise<IActualite[]> {
    const res = await fetchPublicOrNull<{ data: IActualite[] }>("/news", {
      per_page: limite,
      status: "published",
    });

    return (res?.data ?? [])
      .filter((a) => a.status === "published")
      .slice(0, limite);
  },
};
