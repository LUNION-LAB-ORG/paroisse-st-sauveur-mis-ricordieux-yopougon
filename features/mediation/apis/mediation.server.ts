import type { IMediation } from "../types/mediation.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const mediationServerAPI = {
  /** Méditations publiées, de la plus récente à la plus ancienne. */
  async obtenirToutes(): Promise<IMediation[]> {
    const res = await fetchPublicOrNull<{ data: IMediation[] }>("/mediations", {
      per_page: 100,
      status: "published",
      sort_by: "date_at",
      sort_dir: "desc",
    });

    return (res?.data ?? []).filter(
      (m) => !m.status || m.status === "published",
    );
  },

  /** Une méditation publiée (null si absente ou non publiée). */
  async obtenir(id: string): Promise<IMediation | null> {
    if (!/^\d+$/.test(id)) return null;
    const res = await fetchPublicOrNull<{ data: IMediation }>(
      `/mediations/${id}`,
    );
    const m = res?.data ?? null;

    return m && (!m.status || m.status === "published") ? m : null;
  },
};
