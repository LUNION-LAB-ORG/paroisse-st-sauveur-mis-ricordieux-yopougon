import type { Metadata } from "next";
import type { IJourHoraire } from "@/features/horaire/types/horaire.type";

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
import { identiteParoisse } from "@/features/setting/utils/identite";
import { dateDuJour } from "@/lib/charte";

export const revalidate = 60;

const URL_SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://paroisse-st-sauveur-mis-ricordieux.vercel.app";
const MONTANTS_PAR_DEFAUT = [5000, 10000, 25000, 50000, 100000, 250000];
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

/** Lundi de la semaine en cours (AAAA-MM-JJ). */
function lundiDe(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);

  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));

  return d.toISOString().slice(0, 10);
}

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

function montantsSuggeres(valeur: string | undefined): number[] {
  const liste = (valeur ?? "")
    .split(",")
    .map((v) => Number(v.replace(/[^\d]/g, "")))
    .filter((n) => Number.isFinite(n) && n >= 100);

  return liste.length > 0 ? liste : MONTANTS_PAR_DEFAUT;
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

  return (
    <div className="flex flex-col">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(donneesStructurees).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <HeroAccueil identite={identite} vueEglise={identite.vueEglise} />
      <BandeInfos
        jourCourt={jourCourt}
        liturgie={liturgie}
        prochaineCelebration={prochaineCelebration(semaine, maintenant)}
      />

      {/* Mobile : Parole du jour avant les horaires ; desktop : l'inverse (maquette) */}
      <div className="flex flex-col">
        <div className="order-2 lg:order-1">
          <HorairesSemaine
            annonce={annonce}
            aujourdhui={aujourdhui}
            semaine={semaine}
          />
        </div>
        <div className="order-1 lg:order-2">
          <ParoleDuJour liturgie={liturgie} urlPage={URL_SITE} />
        </div>
      </div>

      <NouvelleEglise
        logo={identite.logo}
        montants={montantsSuggeres(settings["donation.amounts"])}
        projet={projet}
        projetDon={settings["donation.project_label"] || "Nouvelle église"}
        vueEglise={identite.vueEglise}
      />
      <Mouvements mouvements={mouvements} />
      <Actualites
        actualites={actualites}
        evenement={evenement}
        publications={publications.data}
      />
      <HistoireCure
        jalons={jalons}
        motDuCure={{
          message: settings["pastor_word.message"] ?? "",
          signature: settings["pastor_word.signature"] ?? "",
          photo: settings["pastor_word.photo"] || null,
        }}
      />
      <EquipePresbyterale pretres={pretres} />
      <AbonnementWhatsapp logo={identite.logo} />
    </div>
  );
}
