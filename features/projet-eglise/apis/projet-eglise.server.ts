import type { IProjetEglise } from "../types/projet-eglise.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const projetEgliseServerAPI = {
  async obtenir(): Promise<IProjetEglise | null> {
    const res = await fetchPublicOrNull<{ data: IProjetEglise }>(
      "/church-project",
    );

    return res?.data ?? null;
  },
};
