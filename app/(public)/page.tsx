import type { Metadata } from "next";
import type { IJourHoraire } from "@/features/horaire/types/horaire.type";

import { Fragment } from "react";

import { AbonnementWhatsapp } from "@/components/accueil/abonnement-whatsapp";
import { Actualites } from "@/components/accueil/actualites";
import { BandeInfos } from "@/components/accueil/bande-infos";
import { EquipePresbyterale } from "@/components/accueil/equipe-presbyterale";
import { HeroAccueil } from "@/components/accueil/hero-accueil";
import { HistoireCure } from "@/components/accueil/histoire-cure";
import { HorairesSemaine } from "@/components/accueil/horaires-semaine";
import { Mouvements } from "@/components/accueil/mouvements";
import { NouvelleEglise } from "@/components/accueil/nouvelle-eglise";
import { ParoleDuJour } from "@/components/accueil/parole-du-jour";
import { actualiteServerAPI } from "@/features/actualite/apis/actualite.server";
import { annonceServerAPI } from "@/features/annonce/apis/annonce.server";
import { evenementServerAPI } from "@/features/evenement/apis/evenement.server";
import { histoireServerAPI } from "@/features/histoire/apis/histoire.server";
import { horaireServerAPI } from "@/features/horaire/apis/horaire.server";
import { liturgieServerAPI } from "@/features/liturgie/apis/liturgie.server";
import { serviceServerAPI } from "@/features/service/apis/service.server";
import { publicationServerAPI } from "@/features/publication/apis/publication.server";
import { pretreServerAPI } from "@/features/pretre/apis/pretre.server";
import { projetEgliseServerAPI } from "@/features/projet-eglise/apis/projet-eglise.server";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import {
  montantsSuggeres,
  projetDonParDefaut,
} from "@/features/setting/utils/don";
import { contenuHero } from "@/features/setting/utils/hero";
import { identiteParoisse } from "@/features/setting/utils/identite";
import { DonneesStructurees } from "@/components/site/donnees-structurees";
import {
  sectionsAccueil,
  type ICleSectionAccueil,
} from "@/features/setting/utils/accueil";
import { dateDuJour, lundiDe, URL_SITE } from "@/lib/charte";

export const revalidate = 60;

const JOURS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export const metadata: Metadata = {
  title: {
    absolute: "Paroisse Saint Sauveur Miséricordieux — Yopougon Millionnaire",
  },
  description:
    "Horaires des messes, Parole du jour, mouvements, construction de la nouvelle église : la vie de la paroisse Saint Sauveur Miséricordieux à Yopougon.",
  openGraph: {
    title: "Paroisse Saint Sauveur Miséricordieux",
    description:
      "Le Sanctuaire de la Miséricorde — une communauté vivante et accueillante à Yopougon Millionnaire.",
    type: "website",
    locale: "fr_CI",
  },
};

/** Prochaine messe non annulée à partir de maintenant (Abidjan = UTC). */
function prochaineCelebration(
  semaine: IJourHoraire[],
  maintenant: Date,
): string | null {
  const aujourdhui = maintenant.toISOString().slice(0, 10);
  const heure = maintenant.toISOString().slice(11, 16);

  for (const jour of semaine) {
    if (jour.date < aujourdhui) continue;
    const messe = jour.items.find(
      (i) =>
        !i.cancelled &&
        i.type === "messe" &&
        (jour.date > aujourdhui || i.time > heure),
    );

    if (messe)
      return jour.date === aujourdhui
        ? `${messe.label}, ${messe.time}`
        : `${JOURS[jour.weekday]}, ${messe.time}`;
  }

  return null;
}

export default async function Accueil() {
  const maintenant = new Date();
  const aujourdhui = dateDuJour(maintenant);

  const [
    settings,
    liturgie,
    semaine,
    annonce,
    projet,
    mouvements,
    actualites,
    evenement,
    jalons,
    pretres,
    publications,
  ] = await Promise.all([
    settingServerAPI.obtenirMap(),
    liturgieServerAPI.obtenirDuJour(aujourdhui),
    horaireServerAPI.obtenirSemaine(lundiDe(aujourdhui)),
    annonceServerAPI.obtenirALaUne(),
    projetEgliseServerAPI.obtenir(),
    serviceServerAPI.obtenirMouvements(),
    actualiteServerAPI.obtenirRecentes(3),
    evenementServerAPI.obtenirProchain(aujourdhui),
    histoireServerAPI.obtenirJalons(),
    pretreServerAPI.obtenirTous(),
    publicationServerAPI.obtenirPage({ per_page: 3 }),
  ]);

  const identite = identiteParoisse(settings);
  const jourCourt = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${aujourdhui}T00:00:00Z`));

  const donneesStructurees = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: identite.nom,
    alternateName: identite.devise,
    description: identite.description,
    url: URL_SITE,
    logo: identite.logo.startsWith("http")
      ? identite.logo
      : `${URL_SITE}${identite.logo}`,
    ...(identite.telephone && { telephone: identite.telephone }),
    ...(identite.email && { email: identite.email }),
    address: {
      "@type": "PostalAddress",
      streetAddress: identite.adresse || "Yopougon Millionnaire",
      addressLocality: "Abidjan",
      addressCountry: "CI",
    },
  };

  const hero = contenuHero(settings, identite);

  const blocs: Record<ICleSectionAccueil, React.ReactNode> = {
    infos: (
      <BandeInfos
        jourCourt={jourCourt}
        liturgie={liturgie}
        prochaineCelebration={prochaineCelebration(semaine, maintenant)}
      />
    ),
    horaires: (
      <HorairesSemaine
        annonce={annonce}
        aujourdhui={aujourdhui}
        semaine={semaine}
      />
    ),
    parole: (
      <ParoleDuJour
        lienPartage={`${URL_SITE}/parole-du-jour`}
        liturgie={liturgie}
      />
    ),
    eglise: (
      <NouvelleEglise
        logo={identite.logo}
        montants={montantsSuggeres(settings)}
        projet={projet}
        projetDon={projetDonParDefaut(settings)}
        vueEglise={identite.vueEglise}
      />
    ),
    mouvements: <Mouvements mouvements={mouvements} />,
    actualites: (
      <Actualites
        actualites={actualites}
        evenement={evenement}
        publications={publications.data}
      />
    ),
    histoire: (
      <HistoireCure
        jalons={jalons}
        motDuCure={{
          message: settings["pastor_word.message"] ?? "",
          signature: settings["pastor_word.signature"] ?? "",
          photo: settings["pastor_word.photo"] || null,
        }}
      />
    ),
    equipe: <EquipePresbyterale pretres={pretres} />,
    whatsapp: <AbonnementWhatsapp logo={identite.logo} />,
  };

  // Ordre et visibilité choisis dans le back-office. Sur mobile, la Parole du
  // jour passe avant les horaires quand les deux blocs se suivent (maquette).
  const ordre = sectionsAccueil(settings);
  const rendu: React.ReactNode[] = [];

  for (let i = 0; i < ordre.length; i++) {
    const cle = ordre[i];

    if (cle === "horaires" && ordre[i + 1] === "parole") {
      rendu.push(
        <div key="horaires-parole" className="flex flex-col">
          <div className="order-2 lg:order-1">{blocs.horaires}</div>
          <div className="order-1 lg:order-2">{blocs.parole}</div>
        </div>,
      );
      i++;
      continue;
    }
    rendu.push(<Fragment key={cle}>{blocs[cle]}</Fragment>);
  }

  return (
    <div className="flex flex-col">
      <DonneesStructurees donnees={donneesStructurees} />
      <HeroAccueil hero={hero} logo={identite.logo} />
      {rendu}
    </div>
  );
}
