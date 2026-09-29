import type { Metadata } from "next";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AbonnementWhatsapp } from "@/components/accueil/abonnement-whatsapp";
import { ParoleDuJour } from "@/components/accueil/parole-du-jour";
import { BandeauPage } from "@/components/site/bandeau-page";
import { DonneesStructurees } from "@/components/site/donnees-structurees";
import { liturgieServerAPI } from "@/features/liturgie/apis/liturgie.server";
import {
  lecturesDuJour,
  titreLecture,
} from "@/features/liturgie/utils/liturgie.utils";
import {
  ajouterJours,
  CONTENEUR,
  dateDuJour,
  dateLongue,
  dateSansAnnee,
  estDateIso,
  LOGO_PAR_DEFAUT,
  teinteLiturgique,
  URL_SITE,
} from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

/** Navigation limitée à une semaine avant et après aujourd'hui. */
const ECART_MAX = 7;

type Props = { searchParams: Promise<{ date?: string }> };

/** Date demandée, bornée à J-7 … J+7 ; null = aujourd'hui. */
function dateDemandee(brute: string | undefined, aujourdhui: string) {
  if (!estDateIso(brute)) return null;
  const min = ajouterJours(aujourdhui, -ECART_MAX);
  const max = ajouterJours(aujourdhui, ECART_MAX);

  if (brute < min) return min;
  if (brute > max) return max;

  return brute;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const aujourdhui = dateDuJour();
  const date =
    dateDemandee((await searchParams).date, aujourdhui) ?? aujourdhui;
  const liturgie = await liturgieServerAPI.obtenirDuJour(date);
  const { evangile } = lecturesDuJour(liturgie);
  const titre =
    date === aujourdhui
      ? "Parole du jour"
      : `Parole du jour — ${dateLongue(date)}`;
  const description = liturgie
    ? [
        `${dateLongue(date)} — ${liturgie.feast}.`,
        evangile &&
          `Évangile (${evangile.ref}) : ${titreLecture(evangile.title)}.`,
        "Lectures de la messe, psaume et homélie de la paroisse.",
      ]
        .filter(Boolean)
        .join(" ")
    : "Les lectures de la messe du jour, le psaume, l’Évangile et l’homélie de la paroisse Saint Sauveur Miséricordieux.";

  return {
    title: titre,
    description,
    alternates: {
      canonical:
        date === aujourdhui
          ? "/parole-du-jour"
          : `/parole-du-jour?date=${date}`,
    },
    openGraph: { title: titre, description, type: "article", locale: "fr_CI" },
  };
}

function LienJour({
  date,
  sens,
  actif,
}: {
  date: string;
  sens: "precedent" | "suivant";
  actif: boolean;
}) {
  const libelle = sens === "precedent" ? "Jour précédent" : "Jour suivant";
  const contenu = (
    <>
      {sens === "precedent" && (
        <ChevronLeft
          aria-hidden
          className="size-4 shrink-0"
          strokeWidth={2.5}
        />
      )}
      <span className="flex flex-col">
        <span>{libelle}</span>
        <span className="text-[13px] font-normal">{dateSansAnnee(date)}</span>
      </span>
      {sens === "suivant" && (
        <ChevronRight
          aria-hidden
          className="size-4 shrink-0"
          strokeWidth={2.5}
        />
      )}
    </>
  );
  const classe = cn(
    "flex min-h-11 items-center gap-2 rounded-charte border px-4 py-2.5 text-sm font-bold",
    sens === "suivant" && "justify-end text-right",
  );

  if (!actif) {
    return (
      <span
        aria-disabled
        className={cn(classe, "border-marine-line text-lavande opacity-60")}
      >
        {contenu}
      </span>
    );
  }

  return (
    <Link
      className={cn(
        classe,
        "border-white text-white hover:bg-white/10 hover:text-white hover:no-underline",
      )}
      href={`/parole-du-jour?date=${date}`}
      rel={sens === "precedent" ? "prev" : "next"}
    >
      {contenu}
    </Link>
  );
}

export default async function PageParoleDuJour({ searchParams }: Props) {
  const aujourdhui = dateDuJour();
  const brute = (await searchParams).date;
  const bornee = dateDemandee(brute, aujourdhui);

  // Adresse canonique : sans paramètre pour aujourd'hui, date bornée sinon
  if (brute !== undefined && bornee !== brute) {
    redirect(
      bornee && bornee !== aujourdhui
        ? `/parole-du-jour?date=${bornee}`
        : "/parole-du-jour",
    );
  }
  if (bornee === aujourdhui) redirect("/parole-du-jour");

  const date = bornee ?? aujourdhui;
  const liturgie = await liturgieServerAPI.obtenirDuJour(date);
  const precedent = ajouterJours(date, -1);
  const suivant = ajouterJours(date, 1);
  const min = ajouterJours(aujourdhui, -ECART_MAX);
  const max = ajouterJours(aujourdhui, ECART_MAX);
  const lienPartage =
    date === aujourdhui
      ? `${URL_SITE}/parole-du-jour`
      : `${URL_SITE}/parole-du-jour?date=${date}`;
  const { evangile } = lecturesDuJour(liturgie);

  return (
    <>
      {liturgie && (
        <DonneesStructurees
          donnees={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `Parole du jour — ${dateLongue(date)}`,
            description: liturgie.feast,
            datePublished: date,
            inLanguage: "fr",
            url: lienPartage,
            ...(evangile?.ref && { about: `Évangile ${evangile.ref}` }),
            publisher: {
              "@type": "Church",
              name: "Paroisse Saint Sauveur Miséricordieux",
              url: URL_SITE,
            },
          }}
        />
      )}
      <BandeauPage
        fil={[{ label: "Accueil", href: "/" }, { label: "Parole du jour" }]}
        sousTitre={
          <span className="flex flex-col gap-2">
            <span className="font-semibold text-white">
              {dateLongue(date)}
              {date === aujourdhui && " · aujourd’hui"}
            </span>
            {liturgie && (
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>
                  {liturgie.feast}
                  {liturgie.degree && ` — ${liturgie.degree}`}
                </span>
                {liturgie.color && (
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block size-3.5 rounded-full border border-white/70"
                      style={{ background: teinteLiturgique(liturgie.color) }}
                    />
                    Couleur liturgique : {liturgie.color}
                  </span>
                )}
              </span>
            )}
            {liturgie?.is_fallback && (
              <span className="text-sm text-ciel">
                Les textes de cette date ne sont pas encore disponibles : ceux
                du dernier jour importé sont affichés.
              </span>
            )}
          </span>
        }
        titre="Parole du jour"
      >
        <nav
          aria-label="Changer de jour"
          className="grid grid-cols-2 gap-3 pb-8 sm:flex sm:flex-wrap sm:items-center lg:pb-[50px]"
        >
          <LienJour
            actif={precedent >= min}
            date={precedent}
            sens="precedent"
          />
          {date !== aujourdhui && (
            <Link
              className="order-last col-span-2 flex min-h-11 items-center justify-center rounded-charte bg-white px-4 py-2.5 text-sm font-bold text-marine hover:bg-brume hover:text-marine hover:no-underline sm:order-none"
              href="/parole-du-jour"
            >
              Revenir à aujourd’hui
            </Link>
          )}
          <LienJour actif={suivant <= max} date={suivant} sens="suivant" />
        </nav>
      </BandeauPage>

      <ParoleDuJour
        key={date}
        mentionAelfMobile
        className="lg:border-t-0"
        entete={
          <span className="hidden text-[17px] leading-[1.5] text-gris lg:block">
            Lectures de la messe du jour, psaume, Évangile
            {liturgie?.homily ? " et homélie de la paroisse" : ""}. Écoutez-les
            ou partagez-les sur WhatsApp.
          </span>
        }
        lienPartage={lienPartage}
        liturgie={liturgie}
        numero=""
        surtitre={dateLongue(date)}
      />

      <section className={cn(CONTENEUR, "pb-4 pt-10 lg:pt-16")}>
        <div className="grid grid-cols-1 gap-6 border-y border-ligne py-8 md:grid-cols-3 md:gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-rouge">
              Homélies de la paroisse
            </span>
            <p className="m-0 text-base leading-[1.55] text-encre-douce">
              Retrouvez les prêtres qui commentent la Parole chaque jour.
            </p>
            <Link
              className="flex min-h-11 items-center text-[15px] font-bold text-rouge hover:text-rouge-hover"
              href="/equipe"
            >
              L’équipe presbytérale
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-rouge">
              Confier une intention
            </span>
            <p className="m-0 text-base leading-[1.55] text-encre-douce">
              Faites célébrer une messe pour vos proches.
            </p>
            <Link
              className="flex min-h-11 items-center text-[15px] font-bold text-rouge hover:text-rouge-hover"
              href="/demande-messe"
            >
              Demander une messe
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-rouge">Sources</span>
            <p className="m-0 text-base leading-[1.55] text-encre-douce">
              Textes liturgiques : AELF (Association épiscopale liturgique pour
              les pays francophones), zone Afrique.
            </p>
            <a
              className="flex min-h-11 items-center text-[15px] font-bold text-rouge hover:text-rouge-hover"
              href="https://www.aelf.org"
              rel="noopener noreferrer"
              target="_blank"
            >
              aelf.org
            </a>
          </div>
        </div>
      </section>

      <div className="pb-4 pt-6 lg:pt-10">
        <AbonnementWhatsapp logo={LOGO_PAR_DEFAUT} />
      </div>
    </>
  );
}
