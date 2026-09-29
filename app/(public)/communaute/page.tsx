import type { Metadata } from "next";

import { PublicationALaUne } from "@/components/communaute/carte-publication";
import { FilPublications } from "@/components/communaute/fil-publications";
import { FilAriane } from "@/components/site/fil-ariane";
import { publicationServerAPI } from "@/features/publication/apis/publication.server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "La vie de la communauté",
  description:
    "Célébrations, mouvements, chantier : les temps forts de la paroisse Saint Sauveur Miséricordieux en images, en vidéos et en mots.",
};

export default async function PageCommunaute() {
  const aLaUne = await publicationServerAPI.obtenirALaUne();
  const premierePage = await publicationServerAPI.obtenirPage({
    per_page: 9,
    exclude: aLaUne?.slug,
  });

  return (
    <FilPublications
      aLaUne={aLaUne ? <PublicationALaUne p={aLaUne} /> : undefined}
      enTete={
        <div className="flex flex-col gap-3.5">
          <FilAriane
            etapes={[{ label: "Accueil", href: "/" }, { label: "Communauté" }]}
          />
          <h1 className="m-0 font-heading text-[30px] font-extrabold tracking-[-0.015em] text-marine lg:text-[46px]">
            La vie de la communauté
          </h1>
          <p className="m-0 text-base text-gris lg:text-[19px]">
            Célébrations, mouvements, chantier : les temps forts de la paroisse
            en images, en vidéos et en mots.
          </p>
        </div>
      }
      exclure={aLaUne?.slug}
      initial={premierePage}
    />
  );
}
