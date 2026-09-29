import type { IExceptionHoraire, IJourHoraire } from "../types/horaire.type";

import { fetchPublicOrNull } from "@/lib/api.public";

export const horaireServerAPI = {
  async obtenirSemaine(start?: string): Promise<IJourHoraire[]> {
    const res = await fetchPublicOrNull<{ data: IJourHoraire[] }>(
      "/schedule/week",
      { start },
    );

    return res?.data ?? [];
  },

  /** Changements d'horaires (célébrations ajoutées ou annulées) entre deux dates. */
  async obtenirExceptions(
    from: string,
    to: string,
  ): Promise<IExceptionHoraire[]> {
    const res = await fetchPublicOrNull<{ data: IExceptionHoraire[] }>(
      "/schedule-exceptions",
      { from, to },
    );

    return (res?.data ?? [])
      .filter((e) => e.date.slice(0, 10) >= from && e.date.slice(0, 10) <= to)
      .sort((a, b) =>
        `${a.date}${a.start_time ?? ""}`.localeCompare(
          `${b.date}${b.start_time ?? ""}`,
        ),
      );
  },
};
