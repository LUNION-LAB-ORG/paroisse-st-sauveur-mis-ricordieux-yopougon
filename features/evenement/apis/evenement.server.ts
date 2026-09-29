import type { IEvenement } from "../types/evenement.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const evenementServerAPI = {
  /** Prochain événement à venir (date ≥ aujourd'hui), le plus proche d'abord. */
  async obtenirProchain(aujourdhui: string): Promise<IEvenement | null> {
    const res = await fetchPublicOrNull<{ data: IEvenement[] }>("/events", {
      per_page: 50,
      sort_by: "date_at",
      sort_dir: "asc",
    });
    const aVenir = (res?.data ?? [])
      .filter((e) => (e.date_at ?? "").slice(0, 10) >= aujourdhui)
      .sort((a, b) => (a.date_at ?? "").localeCompare(b.date_at ?? ""));

    return aVenir[0] ?? null;
  },
};
