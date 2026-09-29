import type { MetadataRoute } from "next";

import { actualiteServerAPI } from "@/features/actualite/apis/actualite.server";
import { agendaServerAPI } from "@/features/evenement/apis/agenda.server";
import { mediationServerAPI } from "@/features/mediation/apis/mediation.server";
import { publicationServerAPI } from "@/features/publication/apis/publication.server";
import { serviceServerAPI } from "@/features/service/apis/service.server";
import { URL_SITE } from "@/lib/charte";

export const revalidate = 3600;

const QUOTIDIENNES = ["", "/parole-du-jour", "/annonces", "/horaires"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [evenements, publications, mouvements, actualites, meditations] =
    await Promise.all([
      agendaServerAPI.obtenirAVenir(100),
      publicationServerAPI.obtenirPage({ per_page: 50 }),
      serviceServerAPI.obtenirMouvements(),
      actualiteServerAPI.obtenirToutes(),
      mediationServerAPI.obtenirToutes(),
    ]);

  const fixes = [
    "",
    "/parole-du-jour",
    "/horaires",
    "/annonces",
    "/agenda",
    "/communaute",
    "/vie-paroissiale",
    "/nouvelle-eglise",
    "/don",
    "/demande-messe",
    "/equipe",
    "/histoire",
    "/contact",
    "/actualites",
    "/meditations",
    "/confidentialite",
  ].map((chemin) => ({
    url: `${URL_SITE}${chemin}`,
    changeFrequency: QUOTIDIENNES.includes(chemin)
      ? ("daily" as const)
      : chemin === "/confidentialite"
        ? ("yearly" as const)
        : ("weekly" as const),
    priority: chemin === "" ? 1 : chemin === "/confidentialite" ? 0.3 : 0.7,
  }));

  return [
    ...fixes,
    ...evenements.map((e) => ({
      url: `${URL_SITE}/agenda/${e.slug ?? e.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...mouvements.map((m) => ({
      url: `${URL_SITE}/vie-paroissiale/${m.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...publications.data.map((p) => ({
      url: `${URL_SITE}/communaute/${p.slug}`,
      lastModified: p.published_at ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...actualites.map((a) => ({
      url: `${URL_SITE}/actualites/${a.id}`,
      lastModified: a.published_at ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...meditations.map((m) => ({
      url: `${URL_SITE}/meditations/${m.id}`,
      lastModified: m.date_at ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
