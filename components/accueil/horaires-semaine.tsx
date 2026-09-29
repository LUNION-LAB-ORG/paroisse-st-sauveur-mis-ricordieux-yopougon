"use client";

import type { IAnnonce } from "@/features/annonce/types/annonce.type";
import type {
  IHoraireItem,
  IJourHoraire,
} from "@/features/horaire/types/horaire.type";

import { Tabs } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

import { EnTeteSection } from "./en-tete-section";

import { CONTENEUR, dateSansAnnee } from "@/lib/charte";
import { cn } from "@/lib/utils";

const JOURS_COURTS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

interface HorairesSemaineProps {
  semaine: IJourHoraire[];
  aujourdhui: string;
  annonce: IAnnonce | null;
}

/** Liste des célébrations d'un jour (compacte : programme du jour sur mobile). */
export function Programme({
  items,
  compact = false,
}: {
  items: IHoraireItem[];
  compact?: boolean;
}) {
  if (items.length === 0) {
    return (
      <p className="m-0 border-b border-ligne py-[18px] text-base text-gris">
        Aucune célébration prévue ce jour-là.
      </p>
    );
  }

  return (
    <ul className="m-0 list-none p-0">
      {items.map((p, i) => (
        <li
          key={`${p.time}-${i}`}
          className={cn(
            "grid items-baseline border-b border-ligne",
            compact
              ? "grid-cols-[80px_minmax(0,1fr)] py-3.5"
              : "grid-cols-[72px_minmax(0,1fr)] gap-y-1 py-4 sm:grid-cols-[120px_minmax(0,1fr)_160px] sm:py-[18px]",
            p.cancelled && "text-gris",
          )}
        >
          <span
            className={cn(
              "font-bold text-marine",
              compact ? "text-base" : "text-base sm:text-lg",
              p.cancelled && "line-through",
            )}
          >
            {p.time}
          </span>
          <span className={compact ? "text-base" : "text-base sm:text-lg"}>
            <span className={cn(p.cancelled && "line-through")}>{p.label}</span>
            {p.cancelled && (
              <span className="ml-2 text-sm font-bold text-rouge no-underline">
                Annulée
              </span>
            )}
          </span>
          {!compact && p.location && (
            <span className="col-start-2 text-sm text-gris sm:col-start-auto sm:text-right sm:text-[15px]">
              {p.location}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Onglets des 7 jours de la semaine + programme du jour choisi. */
export function SemaineOnglets({
  semaine,
  aujourdhui,
}: {
  semaine: IJourHoraire[];
  aujourdhui: string;
}) {
  const [jour, setJour] = useState(
    () =>
      semaine.find((j) => j.date === aujourdhui)?.date ??
      semaine[0]?.date ??
      "",
  );

  if (semaine.length === 0) {
    return (
      <p className="m-0 border-y border-ligne py-10 text-base text-gris">
        Les horaires seront bientôt publiés.
      </p>
    );
  }

  return (
    <Tabs
      className="tabs-charte min-w-0"
      selectedKey={jour}
      variant="secondary"
      onSelectionChange={(k) => setJour(String(k))}
    >
      <Tabs.ListContainer>
        <Tabs.List
          aria-label="Jours de la semaine"
          className="grid grid-cols-7"
        >
          {semaine.map((j) => (
            <Tabs.Tab
              key={j.date}
              aria-label={`${dateSansAnnee(j.date)}${j.date === aujourdhui ? " (aujourd’hui)" : ""}`}
              className="min-w-0 flex-col gap-0 px-0 pb-3.5 pt-3"
              id={j.date}
            >
              <span className="text-xs sm:text-[13px]">
                {JOURS_COURTS[j.weekday]}
              </span>
              <span className="font-heading text-xl font-semibold sm:text-[26px]">
                {Number(j.date.slice(8, 10))}
              </span>
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
      {semaine.map((j) => (
        <Tabs.Panel key={j.date} id={j.date}>
          <div className="pb-2.5 pt-6 font-heading text-[22px] font-semibold text-marine sm:pt-7 sm:text-[26px]">
            {dateSansAnnee(j.date)}
            {j.date === aujourdhui && (
              <span className="ml-3 align-middle text-sm font-bold text-rouge">
                Aujourd’hui
              </span>
            )}
          </div>
          <Programme items={j.items} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

export function HorairesSemaine({
  semaine,
  aujourdhui,
  annonce,
}: HorairesSemaineProps) {
  const duJour = semaine.find((j) => j.date === aujourdhui);

  return (
    <section className="scroll-mt-4" id="horaires">
      <div
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-y-8 pb-2.5 pt-7 lg:grid-cols-12 lg:gap-x-6 lg:pb-[90px] lg:pt-[100px]",
        )}
      >
        <div className="flex flex-col gap-[18px] lg:col-span-4">
          <EnTeteSection
            className="hidden lg:flex"
            numero="01"
            surtitre="Horaires"
            titre="Messes et célébrations de la semaine"
          />
          <h2 className="m-0 font-heading text-[22px] font-extrabold text-marine lg:hidden">
            Horaires du jour
          </h2>
          <p className="m-0 hidden text-[17px] leading-[1.6] text-gris lg:block">
            Les horaires peuvent varier lors des fêtes et solennités. Les
            changements sont annoncés ici.
          </p>

          {/* Mobile : programme du jour uniquement */}
          <div className="lg:hidden">
            <Programme compact items={duJour?.items ?? []} />
            <Link
              className="mt-2 flex min-h-11 items-center text-[15px] font-bold text-rouge hover:text-rouge-hover"
              href="/horaires"
            >
              Horaires de la semaine
            </Link>
          </div>

          {annonce && (
            <div
              className="mt-2.5 flex scroll-mt-4 flex-col gap-1.5 border-t border-ligne pt-[18px]"
              id="annonce"
            >
              <span className="text-[13px] font-bold text-rouge">Annonce</span>
              <span className="text-[17px] font-semibold">{annonce.title}</span>
              <p className="m-0 line-clamp-4 whitespace-pre-line text-[15px] leading-[1.55] text-gris">
                {annonce.content}
              </p>
              {annonce.contact && (
                <span className="text-sm text-gris">
                  Contact : {annonce.contact}
                </span>
              )}
              <Link
                className="text-[15px] font-bold text-rouge hover:text-rouge-hover"
                href="/annonces"
              >
                Toutes les annonces de la semaine
              </Link>
            </div>
          )}
        </div>

        <div className="hidden flex-col lg:col-span-7 lg:col-start-6 lg:flex">
          <SemaineOnglets aujourdhui={aujourdhui} semaine={semaine} />
          <Link
            className="mt-6 flex min-h-11 items-center self-start text-[15px] font-bold text-rouge hover:text-rouge-hover"
            href="/horaires"
          >
            Tous les horaires, confessions et adoration
          </Link>
        </div>
      </div>
    </section>
  );
}
