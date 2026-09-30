import type { ICure } from "../types/cure.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const cureServerAPI = {
  /** Curés successifs, du plus ancien au plus récent. */
  async obtenirTous(): Promise<ICure[]> {
    const res = await fetchPublicOrNull<{ data: ICure[] }>(
      "/pastors?per_page=100&sort_by=started_at&sort_dir=asc",
    );

    return res?.data ?? [];
  },
};
