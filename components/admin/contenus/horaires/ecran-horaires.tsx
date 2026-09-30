"use client";

import type { ICreneau } from "@/features/horaire/types/horaire-admin.type";

import { useMemo, useState } from "react";

import { FicheJour } from "./fiche-jour";
import { TableExceptions } from "./table-exceptions";
import { libelleCreneau } from "./libelles";

import { hhmm, isoJour } from "@/components/admin/contenus/dates";
import { messageErreur } from "@/components/admin/contenus/erreur-api";
import { LectureSeule } from "@/components/admin/contenus/mise-en-page";
import {
  BoutonAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import { useCreneauxQuery } from "@/features/horaire/queries/horaire-admin.query";
import { JOURS_SEMAINE } from "@/features/horaire/types/horaire-admin.type";
import { cn } from "@/lib/utils";

const parHeure = (a: ICreneau, b: ICreneau) =>
  hhmm(a.start_time).localeCompare(hhmm(b.start_time));

/** Écran « Horaires » : semaine type + exceptions datées. */
export function EcranHoraires() {
  const peutEcrire = useDroits().peutModifier("horaires");
  const creneaux = useCreneauxQuery();
  const [jour, setJour] = useState(() =>
    new Date(`${isoJour()}T12:00:00Z`).getUTCDay(),
  );

  const parJour = useMemo(() => {
    const m = new Map<number, ICreneau[]>();

    for (const j of JOURS_SEMAINE) m.set(j.weekday, []);
    for (const c of creneaux.data ?? []) m.get(Number(c.weekday))?.push(c);
    m.forEach((l) => l.sort(parHeure));

    return m;
  }, [creneaux.data]);

  const nomJour = JOURS_SEMAINE.find((j) => j.weekday === jour)?.nom ?? "";

  return (
    <>
      <EnTeteAdmin
        actions={
          <BoutonAdmin cible="_blank" href="/#horaires" variante="neutre">
            Aperçu sur le site
          </BoutonAdmin>
        }
        sousTitre="Semaine type + exceptions datées. Alimente l’accueil, la page Horaires et les créneaux de demande de messe"
        titre="Horaires"
      />
      <ContenuAdmin>
        <LectureSeule visible={!peutEcrire} />
        <div className="grid grid-cols-1 items-start gap-[22px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col gap-[22px]">
            <section className="rounded-admin border border-bord-admin bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-bord-admin px-5 py-4">
                <h2 className="m-0 font-heading text-base font-extrabold text-marine">
                  Semaine type
                </h2>
                <span className="text-[13px] text-gris">
                  Cliquez sur un jour pour le modifier
                </span>
              </div>
              {creneaux.isError ? (
                <div className="p-5">
                  <ErreurChargement
                    message={`La semaine type n’a pas pu être chargée. ${messageErreur(creneaux.error)}`}
                    onReessayer={() => creneaux.refetch()}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
                  {JOURS_SEMAINE.map((j) => {
                    const on = j.weekday === jour;
                    const liste = parJour.get(j.weekday) ?? [];

                    return (
                      <button
                        key={j.weekday}
                        aria-pressed={on}
                        className={cn(
                          "flex min-h-[140px] flex-col items-stretch gap-2 border-t-[3px] border-r border-b border-r-ligne-admin border-b-ligne-admin px-2.5 py-3.5 text-left text-encre lg:min-h-[260px] lg:border-b-0",
                          on
                            ? "border-t-rouge bg-selection-admin"
                            : "border-t-transparent bg-white hover:bg-entete-admin",
                        )}
                        type="button"
                        onClick={() => setJour(j.weekday)}
                      >
                        <span className="text-sm font-bold text-marine">
                          {j.nom}
                        </span>
                        {creneaux.isLoading ? (
                          <span className="text-xs text-gris">Chargement…</span>
                        ) : liste.length === 0 ? (
                          <span className="text-xs text-gris">
                            Aucune célébration
                          </span>
                        ) : (
                          liste.map((c) => (
                            <span
                              key={c.id}
                              className={cn(
                                "flex flex-col gap-px rounded-admin bg-parchemin p-2 text-left",
                                !c.is_available && "opacity-55",
                              )}
                            >
                              <span className="text-[13px] font-bold">
                                {hhmm(c.start_time)}
                              </span>
                              <span className="text-xs text-encre-douce">
                                {libelleCreneau(c)}
                                {!c.is_available && " (suspendue)"}
                              </span>
                            </span>
                          ))
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <TableExceptions
              creneaux={creneaux.data ?? []}
              peutEcrire={peutEcrire}
            />
          </div>

          <FicheJour
            key={`${jour}-${creneaux.dataUpdatedAt}`}
            chargement={creneaux.isLoading}
            creneaux={parJour.get(jour) ?? []}
            nomJour={nomJour}
            peutEcrire={peutEcrire && !creneaux.isError}
            weekday={jour}
          />
        </div>
      </ContenuAdmin>
    </>
  );
}
