import type {
  ICommentaire,
  IPublication,
  IPublicationsPage,
} from "../types/publication.type";

import { fetchPublic, fetchPublicOrNull } from "@/lib/api.public";

export const publicationServerAPI = {
  async obtenirPage(
    params: {
      type?: string;
      page?: number;
      exclude?: string;
      per_page?: number;
      category?: string;
    } = {},
  ): Promise<IPublicationsPage> {
    const res = await fetchPublicOrNull<IPublicationsPage>(
      "/publications",
      params,
    );

    return (
      res ?? {
        data: [],
        meta: { current_page: 1, last_page: 1, per_page: 9, total: 0 },
      }
    );
  },

  async obtenirALaUne(): Promise<IPublication | null> {
    const res = await fetchPublicOrNull<IPublicationsPage>("/publications", {
      featured: 1,
      per_page: 1,
    });

    return res?.data?.find((p) => p.is_featured) ?? null;
  },

  async obtenir(slug: string): Promise<IPublication | null> {
    try {
      return (
        await fetchPublic<{ data: IPublication }>(
          `/publications/${encodeURIComponent(slug)}`,
        )
      ).data;
    } catch {
      return null;
    }
  },

  async obtenirCommentaires(id: number): Promise<ICommentaire[]> {
    const res = await fetchPublicOrNull<{ data: ICommentaire[] }>(
      `/publications/${id}/comments`,
    );

    return res?.data ?? [];
  },
};
