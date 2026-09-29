import type {
  IActivite,
  IIntegration,
  IRessourceOrdonnable,
  ITableauDeBord,
} from "../types/admin.type";

import { getSession } from "next-auth/react";

import { baseURL } from "@/config/api";
import { apiClient } from "@/lib/api.client";

export const adminAPI = {
  tableauDeBord(): Promise<{ data: ITableauDeBord }> {
    return apiClient.request({
      endpoint: "/admin/dashboard",
      method: "GET",
      service: "private",
    });
  },

  activites(limite = 20): Promise<{ data: IActivite[] }> {
    return apiClient.request({
      endpoint: "/admin/activities",
      method: "GET",
      searchParams: { limit: String(limite) },
      service: "private",
    });
  },

  integrations(): Promise<{ data: IIntegration[] }> {
    return apiClient.request({
      endpoint: "/admin/integrations",
      method: "GET",
      service: "private",
    });
  },

  reordonner(resource: IRessourceOrdonnable, ids: number[]): Promise<unknown> {
    return apiClient.request({
      endpoint: "/admin/reorder",
      method: "POST",
      data: { resource, ids },
      service: "private",
    });
  },
};

/**
 * Télécharge un export (CSV) protégé : la requête porte le jeton de session,
 * le fichier est proposé au navigateur sous le nom indiqué.
 */
export async function telechargerExport(
  endpoint: string,
  nomFichier: string,
  params?: Record<string, string>,
) {
  const session = await getSession();
  const url = new URL(`${baseURL.replace(/\/$/, "")}${endpoint}`);

  Object.entries(params ?? {}).forEach(
    ([k, v]) => v && url.searchParams.set(k, v),
  );
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${(session as any)?.user?.token ?? ""}`,
      Accept: "text/csv",
    },
  });

  if (!res.ok)
    throw new Error(
      res.status === 403
        ? "Accès refusé pour votre rôle."
        : "L’export a échoué.",
    );
  const blob = await res.blob();
  const lien = document.createElement("a");

  lien.href = URL.createObjectURL(blob);
  lien.download = nomFichier;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  URL.revokeObjectURL(lien.href);
}
