import type { Metadata } from "next";
import type {
  IExceptionHoraire,
  IJourHoraire,
} from "@/features/horaire/types/horaire.type";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SemaineOnglets } from "@/components/accueil/horaires-semaine";
import { BandeauPage } from "@/components/site/bandeau-page";
import { DonneesStructurees } from "@/components/site/donnees-structurees";
import { horaireServerAPI } from "@/features/horaire/apis/horaire.server";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { identiteParoisse } from "@/features/setting/utils/identite";
import {
  ajouterJours,
  CONTENEUR,
  dateDuJour,
  dateSansAnnee,
  estDateIso,
  heureCourte,
  jourMoisLong,
  lundiDe,
  URL_SITE,
} from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const DESCRIPTION =
  "Horaires des messes de la semaine, confessions, adoration et changements exceptionnels à la paroisse Saint Sauveur Miséricordieux (Yopougon Millionnaire).";

export const metadata: Metadata = {
  title: "Horaires des messes et sacrements",
  description: DESCRIPTION,
  alternates: { canonical: "/horaires" },
  openGraph: {
    title: "Horaires des messes et sacrements",
    description: DESCRIPTION,
    type: "website",
    locale: "fr_CI",
  },
};

/** Navigation : 4 semaines en arrière, 8 en avant. */
const SEMAINES_AVANT = 4;
const SEMAINES_APRES = 8;
const JOURS_PLURIEL = [
  "dimanches",
  "lundis",
  "mardis",
  "mercredis",
  "jeudis",
  "vendredis",
  "samedis",
];

type Props = { searchParams: Promise<{ semaine?: string }> };

/** « Samedi 16:00 », « Jeudi 19:00 » : créneaux d'un type sur la semaine. */
function creneauxDuType(semaine: IJourHoraire[], type: string): string[] {
  const vus = new Set<string>();

  semaine.forEach((j) =>
    j.items
      .filter((i) => i.type === type && !i.cancelled)
      .forEach((i) =>
        vus.add(
          `Les ${JOURS_PLURIEL[j.weekday]} à ${i.time}${i.end_time ? ` (jusqu’à ${heureCourte(i.end_time)})` : ""}`,
        ),
      ),
  );

  return Array.from(vus);
}

const NOMS_JOURS = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

/** « 06:30 et 18:30 » */
const listeHeures = (h: string[]) =>
  h.length > 1
    ? `${h.slice(0, -1).join(", ")} et ${h[h.length - 1]}`
    : (h[0] ?? "");

/**
 * Messes en semaine, calculées depuis les horaires réels : jours consécutifs
 * ayant les mêmes heures regroupés (« Du lundi au jeudi : 06:30 et 18:30 »).
 */
function messesEnSemaine(semaine: IJourHoraire[]): string[] {
  const parJour = [1, 2, 3, 4, 5, 6].map((wd) => {
    const jour = semaine.find((j) => j.weekday === wd);

    return {
      wd,
      heures: (jour?.items ?? [])
        .filter((i) => i.type === "messe" && !i.cancelled)
        .map((i) => i.time),
    };
  });
  const groupes: { debut: number; fin: number; heures: string[] }[] = [];

  parJour.forEach((j) => {
    const dernier = groupes[groupes.length - 1];

    if (
      dernier &&
      dernier.heures.join() === j.heures.join() &&
      dernier.fin === j.wd - 1
    )
      dernier.fin = j.wd;
    else groupes.push({ debut: j.wd, fin: j.wd, heures: j.heures });
  });

  return groupes
    .filter((g) => g.heures.length > 0)
    .map((g) => {
      const jours =
        g.debut === g.fin
          ? NOMS_JOURS[g.debut].replace(/^./, (c) => c.toUpperCase())
          : `Du ${NOMS_JOURS[g.debut]} au ${NOMS_JOURS[g.fin]}`;

      return `${jours} : ${listeHeures(g.heures)}`;
    });
}

function libelleSemaine(lundi: string) {
  const dimanche = ajouterJours(lundi, 6);

  return `Semaine du ${jourMoisLong(lundi)} au ${jourMoisLong(dimanche)} ${dimanche.slice(0, 4)}`;
}

function LienSemaine({
  lundi,
  sens,
  actif,
}: {
  lundi: string;
  sens: "precedente" | "suivante";
  actif: boolean;
}) {
  const libelle =
    sens === "precedente" ? "Semaine précédente" : "Semaine suivante";
  const classe =
    "flex min-h-11 items-center gap-1.5 rounded-charte border px-4 py-2.5 text-sm font-bold";
  const icone =
    sens === "precedente" ? (
      <ChevronLeft aria-hidden className="size-4" strokeWidth={2.5} />
    ) : (
      <ChevronRight aria-hidden className="size-4" strokeWidth={2.5} />
    );

  if (!actif) {
    return (
      <span
        aria-disabled
        className={cn(classe, "border-marine-line text-lavande opacity-60")}
      >
        {sens === "precedente" && icone}
        {libelle}
        {sens === "suivante" && icone}
      </span>
    );
  }

  return (
    <Link
      className={cn(
        classe,
        "justify-center border-white text-white hover:bg-white/10 hover:text-white hover:no-underline",
      )}
      href={`/horaires?semaine=${lundi}`}
      rel={sens === "precedente" ? "prev" : "next"}
    >
      {sens === "precedente" && icone}
      {libelle}
      {sens === "suivante" && icone}
    </Link>
  );
}

function Exception({ e }: { e: IExceptionHoraire }) {
  return (
    <li className="grid grid-cols-1 gap-1 border-t border-ligne py-4 sm:grid-cols-[200px_90px_minmax(0,1fr)] sm:gap-4">
      <span className="font-heading text-base font-bold text-marine">
        {dateSansAnnee(e.date.slice(0, 10))}
      </span>
      <span
        className={cn(
          "font-bold text-marine",
          e.is_cancelled && "line-through",
        )}
      >
        {heureCourte(e.start_time) || "—"}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className={cn("break-words", e.is_cancelled && "text-gris")}>
          {e.label || (e.is_cancelled ? "Célébration" : "Célébration ajoutée")}
          {e.is_cancelled && (
            <span className="ml-2 text-sm font-bold text-rouge">Annulée</span>
          )}
          {!e.is_cancelled && (
            <span className="ml-2 text-sm font-bold text-azur">
              Exceptionnelle
            </span>
          )}
        </span>
        {e.location && <span className="text-sm text-gris">{e.location}</span>}
      </span>
    </li>
  );
}

export default async function PageHoraires({ searchParams }: Props) {
  const aujourdhui = dateDuJour();
  const lundiCourant = lundiDe(aujourdhui);
  const min = ajouterJours(lundiCourant, -7 * SEMAINES_AVANT);
  const max = ajouterJours(lundiCourant, 7 * SEMAINES_APRES);
  const brute = (await searchParams).semaine;

  let lundi = lundiCourant;

  if (brute !== undefined) {
    const voulu = estDateIso(brute) ? lundiDe(brute) : lundiCourant;
    const borne = voulu < min ? min : voulu > max ? max : voulu;

    if (borne === lundiCourant) redirect("/horaires");
    if (borne !== brute) redirect(`/horaires?semaine=${borne}`);
    lundi = borne;
  }

  const [semaine, exceptions, settings] = await Promise.all([
    horaireServerAPI.obtenirSemaine(lundi),
    horaireServerAPI.obtenirExceptions(
      aujourdhui,
      ajouterJours(aujourdhui, 60),
    ),
    settingServerAPI.obtenirMap(),
  ]);
  const identite = identiteParoisse(settings);

  // Résumé calculé depuis les horaires saisis dans le back-office (source unique)
  const dimanche = semaine.find((j) => j.weekday === 0);
  const messesDimanche = (dimanche?.items ?? [])
    .filter((i) => i.type === "messe" && !i.cancelled)
    .map((i) => i.time);
  const rappels = [
    {
      titre: "Messes du dimanche",
      valeurs: messesDimanche.length ? [listeHeures(messesDimanche)] : [],
    },
    { titre: "Messes en semaine", valeurs: messesEnSemaine(semaine) },
    { titre: "Confessions", valeurs: creneauxDuType(semaine, "confession") },
    {
      titre: "Adoration du Saint-Sacrement",
      valeurs: creneauxDuType(semaine, "adoration"),
    },
  ].filter((r) => r.valeurs.length > 0);

  return (
    <>
      <DonneesStructurees
        donnees={{
          "@context": "https://schema.org",
          "@type": "Church",
          name: identite.nom,
          url: URL_SITE,
          address: {
            "@type": "PostalAddress",
            streetAddress: identite.adresse || "Yopougon Millionnaire",
            addressLocality: "Abidjan",
            addressCountry: "CI",
          },
          event: semaine.flatMap((j) =>
            j.items
              .filter((i) => i.type === "messe" && !i.cancelled)
              .map((i) => ({
                "@type": "Event",
                name: i.label,
                startDate: `${j.date}T${i.time}:00+00:00`,
                eventAttendanceMode:
                  "https://schema.org/OfflineEventAttendanceMode",
                location: {
                  "@type": "Place",
                  name: i.location || identite.nom,
                  address: identite.adresse || "Yopougon Millionnaire, Abidjan",
                },
              })),
          ),
        }}
      />
      <BandeauPage
        fil={[
          { label: "Accueil", href: "/" },
          { label: "La paroisse" },
          { label: "Horaires" },
        ]}
        sousTitre={libelleSemaine(lundi)}
        titre="Horaires des messes et sacrements"
      >
        <nav
          aria-label="Changer de semaine"
          className="grid grid-cols-2 gap-3 pb-8 sm:flex sm:flex-wrap lg:pb-[50px]"
        >
          <LienSemaine
            actif={ajouterJours(lundi, -7) >= min}
            lundi={ajouterJours(lundi, -7)}
            sens="precedente"
          />
          {lundi !== lundiCourant && (
            <Link
              className="order-last col-span-2 flex min-h-11 items-center justify-center rounded-charte bg-white px-4 py-2.5 text-sm font-bold text-marine hover:bg-brume hover:text-marine hover:no-underline sm:order-none"
              href="/horaires"
            >
              Cette semaine
            </Link>
          )}
          <LienSemaine
            actif={ajouterJours(lundi, 7) <= max}
            lundi={ajouterJours(lundi, 7)}
            sens="suivante"
          />
        </nav>
      </BandeauPage>

      <section
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-10 pb-14 pt-10 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-[60px]",
        )}
      >
        <div className="min-w-0 lg:col-span-7">
          <h2 className="sr-only">Programme de la semaine</h2>
          <SemaineOnglets
            key={lundi}
            aujourdhui={aujourdhui}
            semaine={semaine}
          />
          <p className="m-0 mt-5 text-[15px] leading-[1.6] text-gris">
            Les horaires peuvent varier lors des fêtes et solennités : les
            changements sont signalés ici et dans les{" "}
            <Link
              className="font-bold text-rouge hover:text-rouge-hover"
              href="/annonces"
            >
              annonces paroissiales
            </Link>
            .
          </p>
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
          {rappels.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-marine pt-[18px]">
              <h2 className="m-0 font-heading text-[17px] font-extrabold text-marine">
                En résumé
              </h2>
              <dl className="m-0 flex flex-col gap-3">
                {rappels.map((r) => (
                  <div key={r.titre} className="flex flex-col gap-0.5">
                    <dt className="text-[13px] font-bold text-rouge">
                      {r.titre}
                    </dt>
                    {r.valeurs.map((v) => (
                      <dd key={v} className="m-0 text-[15px] text-encre-douce">
                        {v}
                      </dd>
                    ))}
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="flex flex-col gap-3 border-t border-marine pt-[18px]">
            <h2 className="m-0 font-heading text-[17px] font-extrabold text-marine">
              Sacrements et services
            </h2>
            <p className="m-0 text-[15px] leading-[1.55] text-gris">
              Confession, accompagnement spirituel, baptême, mariage : un prêtre
              vous reçoit sur rendez-vous.
            </p>
            <Link
              className="rounded-charte bg-marine px-5 py-3.5 text-center text-[15px] font-bold text-white hover:bg-marine-deep hover:text-white hover:no-underline"
              href="/equipe#rdv"
            >
              Prendre rendez-vous avec un prêtre
            </Link>
            <Link
              className="rounded-charte border border-marine px-5 py-[13px] text-center text-[15px] font-bold text-marine hover:text-marine hover:no-underline"
              href="/demande-messe"
            >
              Demander une messe
            </Link>
          </div>
        </aside>
      </section>

      <section className="border-t border-ligne bg-white">
        <div
          className={cn(
            CONTENEUR,
            "grid grid-cols-1 gap-8 py-14 lg:grid-cols-12 lg:gap-x-6 lg:py-20",
          )}
        >
          <div className="flex flex-col gap-4 lg:col-span-4">
            <span className="text-sm font-bold text-rouge">
              Dans les deux prochains mois
            </span>
            <h2 className="m-0 font-heading text-[26px] font-extrabold leading-[1.1] text-marine lg:text-[34px]">
              Changements d’horaires
            </h2>
            <p className="m-0 text-base leading-[1.6] text-gris lg:text-[17px]">
              Célébrations exceptionnelles et messes annulées.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            {exceptions.length > 0 ? (
              <ul className="m-0 list-none border-b border-ligne p-0">
                {exceptions.map((e) => (
                  <Exception key={e.id} e={e} />
                ))}
              </ul>
            ) : (
              <p className="m-0 border-y border-ligne py-6 text-base text-gris">
                Aucun changement d’horaire n’est prévu pour le moment.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
