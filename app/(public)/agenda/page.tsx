import type { Metadata } from "next";
import type { IEvenement } from "@/features/evenement/types/evenement.type";

import Link from "next/link";

import { BandeauPage } from "@/components/site/bandeau-page";
import { agendaServerAPI } from "@/features/evenement/apis/agenda.server";
import { CONTENEUR, dateLongue, heureCourte, pastilleDate } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Agenda",
  description:
    "Les prochains événements de la paroisse Saint Sauveur Miséricordieux : célébrations, journées paroissiales, veillées.",
};

function LigneEvenement({
  e,
  passe = false,
}: {
  e: IEvenement;
  passe?: boolean;
}) {
  const p = pastilleDate(e.date_at);

  return (
    <li>
      <Link
        className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-x-5 gap-y-1 border-t border-ligne py-[22px] text-encre hover:text-encre hover:no-underline md:grid-cols-[76px_minmax(0,1fr)_220px_110px]"
        href={`/agenda/${e.slug ?? e.id}`}
      >
        <span
          className={cn(
            "row-span-2 flex h-[72px] flex-col items-center justify-center md:row-span-1",
            passe ? "bg-lin text-gris" : "bg-marine text-white",
          )}
        >
          <span className="font-heading text-2xl font-extrabold leading-none">
            {p.jour}
          </span>
          <span className="text-xs font-bold uppercase">{p.mois}</span>
        </span>
        <span className="flex flex-col gap-1">
          <span
            className={cn(
              "font-heading text-lg font-bold lg:text-[19px]",
              passe ? "text-gris" : "text-marine",
            )}
          >
            {e.title}
          </span>
          <span className="text-sm text-gris">
            {dateLongue(e.date_at.slice(0, 10))}
            {e.time_at && ` · ${heureCourte(e.time_at)}`}
          </span>
        </span>
        <span className="text-[15px] text-gris">{e.location_at}</span>
        <span className="hidden text-right text-[15px] font-bold text-rouge md:block">
          Détails
        </span>
      </Link>
    </li>
  );
}

export default async function PageAgenda() {
  const [aVenir, passes] = await Promise.all([
    agendaServerAPI.obtenirAVenir(),
    agendaServerAPI.obtenirPasses(),
  ]);

  return (
    <>
      <BandeauPage
        fil={[{ label: "Accueil", href: "/" }, { label: "Agenda" }]}
        sousTitre="Célébrations, journées paroissiales, veillées : les rendez-vous de la communauté."
        titre="Agenda paroissial"
      />

      <section
        className={cn(CONTENEUR, "flex flex-col gap-6 py-12 lg:py-[70px]")}
      >
        <h2 className="m-0 font-heading text-2xl font-extrabold text-marine lg:text-[30px]">
          Événements à venir
        </h2>
        {aVenir.length === 0 ? (
          <p className="m-0 border-t border-ligne py-6 text-base text-gris">
            Aucun événement n’est programmé pour le moment.
          </p>
        ) : (
          <ul className="m-0 list-none p-0">
            {aVenir.map((e) => (
              <LigneEvenement key={e.id} e={e} />
            ))}
          </ul>
        )}
      </section>

      {passes.length > 0 && (
        <section className="border-t border-ligne bg-white">
          <details className={cn(CONTENEUR, "group py-10")}>
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-heading text-xl font-extrabold text-marine">
              Événements passés
              <span className="text-[15px] font-bold text-rouge group-open:hidden">
                Afficher
              </span>
              <span className="hidden text-[15px] font-bold text-rouge group-open:inline">
                Masquer
              </span>
            </summary>
            <ul className="m-0 mt-4 list-none p-0">
              {passes.map((e) => (
                <LigneEvenement key={e.id} passe e={e} />
              ))}
            </ul>
          </details>
        </section>
      )}
    </>
  );
}
