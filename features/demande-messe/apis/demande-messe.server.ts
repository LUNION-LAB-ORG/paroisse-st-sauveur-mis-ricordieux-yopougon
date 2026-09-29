import type { IDemandeMesse } from "../types/demande-messe.type";

import { baseURL } from "@/config/api";

export const demandeMesseServerAPI = {
  /** Récapitulatif d'une demande (jeton requis) — jamais mis en cache. */
  async obtenir(numero: string, jeton: string): Promise<IDemandeMesse | null> {
    const url = `${baseURL.replace(/\/$/, "")}/mass-requests/${encodeURIComponent(numero)}?t=${encodeURIComponent(jeton)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return ((await res.json()) as { data: IDemandeMesse }).data;
  },
};

/** Lien public du fichier .ics d'une demande de messe. */
export const lienIcsDemande = (numero: string, jeton: string) =>
  `${baseURL.replace(/\/$/, "")}/mass-requests/${encodeURIComponent(numero)}/ics?t=${encodeURIComponent(jeton)}`;
