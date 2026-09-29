import type { Metadata } from "next";

import Link from "next/link";

import { DonRapide } from "@/components/accueil/don-rapide";
import { EmplacementImage } from "@/components/accueil/emplacement-image";
import { Jauge, LIBELLE_STATUT } from "@/components/accueil/nouvelle-eglise";
import { CartePublication } from "@/components/communaute/carte-publication";
import { GalerieVisionneuse } from "@/components/eglise/galerie-visionneuse";
import { BandeauPage } from "@/components/site/bandeau-page";
import { DonneesStructurees } from "@/components/site/donnees-structurees";
import { LIEN_DON } from "@/components/site/navigation";
import { projetEgliseServerAPI } from "@/features/projet-eglise/apis/projet-eglise.server";
import { publicationServerAPI } from "@/features/publication/apis/publication.server";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import {
  montantsSuggeres,
  projetDonParDefaut,
} from "@/features/setting/utils/don";
import { identiteParoisse } from "@/features/setting/utils/identite";
import {
  CONTENEUR,
  enParagraphes,
  formatMontant,
  lienTelephone,
  URL_SITE,
} from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const DESCRIPTION =
  "Le projet de construction de la nouvelle église Saint Sauveur Miséricordieux : vue d’architecte, avancement du chantier, collecte et dons en ligne.";

export const metadata: Metadata = {
  title: "Nouvelle église",
  description: DESCRIPTION,
  alternates: { canonical: "/nouvelle-eglise" },
  openGraph: {
    title: "Construction de la nouvelle église",
    description: DESCRIPTION,
    type: "website",
    locale: "fr_CI",
  },
};

const SURTITRE = "text-sm font-bold text-rouge";
const TITRE_H2 =
  "m-0 font-heading text-[26px] font-extrabold leading-[1.1] text-marine lg:text-[34px]";

export default async function PageNouvelleEglise() {
  const [projet, settings, chantier] = await Promise.all([
    projetEgliseServerAPI.obtenir(),
    settingServerAPI.obtenirMap(),
    publicationServerAPI.obtenirPage({ category: "Chantier", per_page: 3 }),
  ]);

  const identite = identiteParoisse(settings);
  const titre = projet?.title ?? "Construction de la nouvelle église";
  const image = projet?.image ?? identite.vueEglise;
  const presentation = enParagraphes(projet?.presentation);
  const photos = projet?.gallery ?? [];
  const phases = projet?.phases ?? [];
  const projetDon = projetDonParDefaut(settings);
  const phaseEnCours = phases.find((p) => p.status === "in_progress");
  const lienDon = `${LIEN_DON}?${new URLSearchParams({ projet: projetDon }).toString()}`;

  return (
    <>
      <DonneesStructurees
        donnees={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: titre,
          description: DESCRIPTION,
          url: `${URL_SITE}/nouvelle-eglise`,
          ...(image && { primaryImageOfPage: image }),
          about: {
            "@type": "Church",
            name: identite.nom,
            url: URL_SITE,
          },
        }}
      />
      <BandeauPage
        action={
          <Link
            className="shrink-0 self-start rounded-charte bg-rouge px-[26px] py-4 text-center text-base font-bold text-white hover:bg-rouge-hover hover:text-white hover:no-underline lg:self-auto"
            href={lienDon}
          >
            Soutenir la construction
          </Link>
        }
        fil={[{ label: "Accueil", href: "/" }, { label: "Nouvelle église" }]}
        sousTitre={
          phaseEnCours
            ? `Projet paroissial · phase en cours : ${phaseEnCours.name}`
            : "Projet paroissial : bâtir ensemble la maison de la communauté."
        }
        titre={titre}
      />

      {/* Présentation + collecte */}
      <section
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-10 pb-14 pt-10 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-[60px]",
        )}
      >
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
          <figure className="m-0 flex flex-col gap-3">
            <EmplacementImage
              alt="Vue d’architecte de la future église Saint Sauveur Miséricordieux"
              className="h-[220px] w-full rounded-charte sm:h-[340px] lg:h-[440px]"
              libelle="Vue d’architecte de la future église"
              src={image}
            />
            <figcaption className="text-sm text-gris">
              Vue d’architecte de la future église
            </figcaption>
          </figure>
          <span className={SURTITRE}>01 — Le projet</span>
          <h2 className={TITRE_H2}>Pourquoi une nouvelle église ?</h2>
          {presentation.length > 0 ? (
            <div className="flex flex-col gap-4 text-[17px] leading-[1.7] text-[#2C2C36] lg:text-lg">
              {presentation.map((p, i) => (
                <p key={i} className="m-0 whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p className="m-0 text-base leading-[1.6] text-gris">
              La présentation détaillée du projet sera bientôt publiée. Le
              secrétariat paroissial répond à vos questions.
            </p>
          )}
        </div>

        <aside className="flex flex-col gap-5 lg:col-span-5 lg:col-start-8">
          <div className="lg:sticky lg:top-6 flex flex-col gap-5">
            {projet && (
              <div className="bg-marine p-6 text-white lg:p-[30px]">
                <span className="mb-4 block text-sm font-bold text-ciel">
                  La collecte
                </span>
                <Jauge compacte projet={projet} />
                {projet.goal_amount > projet.collected_amount && (
                  <p className="m-0 mt-4 text-sm text-brume">
                    Il reste{" "}
                    {formatMontant(
                      projet.goal_amount - projet.collected_amount,
                    )}{" "}
                    FCFA à réunir.
                  </p>
                )}
              </div>
            )}
            <div className="border border-ligne">
              <DonRapide
                logo={identite.logo}
                montants={montantsSuggeres(settings)}
                projet={projetDon}
              />
            </div>
          </div>
        </aside>
      </section>

      {/* Phases */}
      {phases.length > 0 && (
        <section className="border-y border-ligne bg-white">
          <div
            className={cn(
              CONTENEUR,
              "grid grid-cols-1 gap-8 py-14 lg:grid-cols-12 lg:gap-x-6 lg:py-20",
            )}
          >
            <div className="flex flex-col gap-4 lg:col-span-4">
              <span className={SURTITRE}>02 — Le chantier</span>
              <h2 className={TITRE_H2}>Les étapes de la construction</h2>
              <p className="m-0 text-base leading-[1.6] text-gris lg:text-[17px]">
                L’avancement est mis à jour par l’équipe du projet à chaque
                étape franchie.
              </p>
            </div>
            <ol className="m-0 flex list-none flex-col p-0 lg:col-span-7 lg:col-start-6">
              {phases.map((ph, i) => (
                <li
                  key={`${ph.name}-${i}`}
                  aria-current={
                    ph.status === "in_progress" ? "step" : undefined
                  }
                  className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-4 border-t border-ligne py-5 sm:grid-cols-[72px_minmax(0,1fr)_auto]"
                >
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full font-heading text-lg font-bold",
                      ph.status === "done" && "bg-marine text-white",
                      ph.status === "in_progress" &&
                        "border-2 border-rouge text-rouge",
                      ph.status === "upcoming" &&
                        "border border-champ text-gris",
                    )}
                  >
                    {ph.status === "done" ? "✓" : i + 1}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[13px] text-gris">Phase {i + 1}</span>
                    <span className="break-words font-heading text-lg font-bold text-marine lg:text-xl">
                      {ph.name}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "col-start-2 text-sm font-bold sm:col-start-auto sm:text-right",
                      ph.status === "done" && "text-marine",
                      ph.status === "in_progress" && "text-rouge",
                      ph.status === "upcoming" && "text-gris",
                    )}
                  >
                    {LIBELLE_STATUT[ph.status] ?? ph.status}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Galerie */}
      <section
        className={cn(
          CONTENEUR,
          "flex scroll-mt-4 flex-col gap-6 py-14 lg:py-20",
        )}
        id="galerie"
      >
        <div className="flex flex-col gap-4">
          <span className={SURTITRE}>03 — En images</span>
          <h2 className={TITRE_H2}>Galerie du chantier</h2>
        </div>
        {photos.length > 0 ? (
          <GalerieVisionneuse
            legende="Chantier de la nouvelle église"
            photos={photos}
          />
        ) : (
          <p className="m-0 border-t border-ligne py-6 text-base text-gris">
            Les photos du chantier seront publiées ici au fil des travaux.
          </p>
        )}
      </section>

      {/* Nouvelles du chantier */}
      {chantier.data.length > 0 && (
        <section className="border-t border-ligne bg-white">
          <div className={cn(CONTENEUR, "flex flex-col gap-8 py-14 lg:py-20")}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-4">
                <span className={SURTITRE}>04 — Nouvelles du chantier</span>
                <h2 className={TITRE_H2}>Dernières publications</h2>
              </div>
              <Link
                className="flex min-h-11 items-center text-[15px] font-bold text-rouge hover:text-rouge-hover"
                href="/communaute"
              >
                Toutes les publications
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-6">
              {chantier.data.map((p) => (
                <CartePublication key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Appel à contribution */}
      <section className="bg-marine text-white">
        <div
          className={cn(
            CONTENEUR,
            "grid grid-cols-1 gap-8 py-14 lg:grid-cols-12 lg:gap-x-6 lg:py-20",
          )}
        >
          <div className="flex flex-col gap-4 lg:col-span-6">
            <span className="text-sm font-bold text-ciel">
              Chaque don compte
            </span>
            <h2 className="m-0 font-heading text-[26px] font-extrabold leading-[1.1] lg:text-[36px]">
              Bâtissons ensemble la maison de Dieu
            </h2>
            <p className="m-0 text-base leading-[1.65] text-brume lg:text-lg">
              Par un don en ligne, au secrétariat, ou par la prière : chacun
              peut apporter sa pierre. Les bienfaiteurs qui le souhaitent sont
              nommés dans la prière de la communauté.
            </p>
          </div>
          <ul className="m-0 flex list-none flex-col p-0 lg:col-span-5 lg:col-start-8">
            <li className="flex flex-col gap-1 border-t border-marine-line py-4">
              <span className="font-bold">Don en ligne</span>
              <span className="text-[15px] text-brume">
                Paiement sécurisé par Wave, reçu envoyé par SMS ou WhatsApp.
              </span>
              <Link
                className="flex min-h-11 items-center font-bold text-ciel hover:text-white"
                href={lienDon}
              >
                Faire un don
              </Link>
            </li>
            <li className="flex flex-col gap-1 border-t border-marine-line py-4">
              <span className="font-bold">Au secrétariat paroissial</span>
              <span className="text-[15px] text-brume">
                Espèces ou chèque, contre reçu
                {settings["parish.office_hours"]
                  ? ` — ${settings["parish.office_hours"]}`
                  : ""}
                .
              </span>
              {identite.telephone && (
                <a
                  className="flex min-h-11 items-center font-bold text-ciel hover:text-white"
                  href={lienTelephone(identite.telephone)}
                >
                  {identite.telephone}
                </a>
              )}
            </li>
            <li className="flex flex-col gap-1 border-y border-marine-line py-4">
              <span className="font-bold">Par la prière</span>
              <span className="text-[15px] text-brume">
                Confiez le chantier et ceux qui y travaillent à la prière de la
                communauté.
              </span>
              <Link
                className="flex min-h-11 items-center font-bold text-ciel hover:text-white"
                href="/demande-messe"
              >
                Demander une messe
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
