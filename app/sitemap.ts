import type { MetadataRoute } from "next";

import { agendaServerAPI } from "@/features/evenement/apis/agenda.server";
import { publicationServerAPI } from "@/features/publication/apis/publication.server";

const URL_SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://paroisse-st-sauveur-mis-ricordieux.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [evenements, publications] = await Promise.all([
    agendaServerAPI.obtenirAVenir(100),
    publicationServerAPI.obtenirPage({ per_page: 50 }),
  ]);

  const fixes = [
    "",
    "/agenda",
    "/annonces",
    "/communaute",
    "/equipe",
    "/demande-messe",
    "/faire-don",
    "/historique",
  ].map((chemin) => ({
    url: `${URL_SITE}${chemin}`,
    changeFrequency:
      chemin === "" || chemin === "/annonces"
        ? ("daily" as const)
        : ("weekly" as const),
    priority: chemin === "" ? 1 : 0.7,
  }));

  return [
    ...fixes,
    ...evenements.map((e) => ({
      url: `${URL_SITE}/agenda/${e.slug ?? e.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...publications.data.map((p) => ({
      url: `${URL_SITE}/communaute/${p.slug}`,
      lastModified: p.published_at ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
