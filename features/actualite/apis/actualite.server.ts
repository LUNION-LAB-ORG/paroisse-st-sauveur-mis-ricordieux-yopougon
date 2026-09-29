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

  /** Toutes les actualités publiées, de la plus récente à la plus ancienne. */
  async obtenirToutes(): Promise<IActualite[]> {
    const res = await fetchPublicOrNull<{ data: IActualite[] }>("/news", {
      per_page: 100,
      status: "published",
      sort_by: "published_at",
      sort_dir: "desc",
    });

    return (res?.data ?? []).filter((a) => a.status === "published");
  },

  /** Une actualité publiée (null si absente ou non publiée). */
  async obtenir(id: string): Promise<IActualite | null> {
    if (!/^\d+$/.test(id)) return null;
    const res = await fetchPublicOrNull<{ data: IActualite }>(`/news/${id}`);

    return res?.data?.status === "published" ? res.data : null;
  },
};
