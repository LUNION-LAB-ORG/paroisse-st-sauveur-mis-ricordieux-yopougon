"use client";

import type { TonPastille } from "@/components/admin/ui/kit";
import type {
  IHomelieAdmin,
  IJourLiturgique,
} from "@/features/liturgie/types/liturgie-admin.type";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { FormulaireHomelie } from "./formulaire-homelie";
import { CarteTextesAelf } from "./carte-textes-aelf";

import {
  ajouterJours,
  isoJour,
  jourCourt,
  libelleSemaine,
  lundiDe,
} from "@/components/admin/contenus/dates";
import { messageErreur } from "@/components/admin/contenus/erreur-api";
import { LectureSeule } from "@/components/admin/contenus/mise-en-page";
import {
  BoutonAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
  Pastille,
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import { useImporterLiturgieMutation } from "@/features/liturgie/queries/liturgie-admin.mutation";
import {
  useHomeliesQuery,
  useJoursLiturgiquesQuery,
  usePretresQuery,
} from "@/features/liturgie/queries/liturgie-admin.query";
import { cn } from "@/lib/utils";

export type IEtatJour = "publiee" | "planifiee" | "brouillon" | "a-rediger";

export const ETATS_HOMELIE: Record<
  IEtatJour,
  { court: string; long: string; ton: TonPastille }
> = {
  publiee: { court: "Publiée", long: "Homélie publiée", ton: "succes" },
  planifiee: { court: "Planifiée", long: "Planifiée", ton: "info" },
  brouillon: { court: "Brouillon", long: "Brouillon", ton: "neutre" },
  "a-rediger": { court: "À rédiger", long: "À rédiger", ton: "attention" },
};

export function etatHomelie(h: IHomelieAdmin | undefined): IEtatJour {
  if (!h) return "a-rediger";
  const etat =
    h.state ??
    (h.status !== "published"
      ? "draft"
      : h.publish_at &&
          new Date(h.publish_at.replace(" ", "T") + "Z") > new Date()
        ? "scheduled"
        : "published");

  return etat === "published"
    ? "publiee"
    : etat === "scheduled"
      ? "planifiee"
      : "brouillon";
}

/** Écran « Parole du jour et homélie ». */
export function EcranLiturgie() {
  const droits = useDroits();
  const peutEcrire = droits.peutModifier("liturgie");
  const aujourdhui = isoJour();
  const [lundi, setLundi] = useState(() => lundiDe(aujourdhui));
  const [choisi, setChoisi] = useState(aujourdhui);
  const [importe, setImporte] = useState(false);
  const dimanche = ajouterJours(lundi, 6);

  const jours = useJoursLiturgiquesQuery(lundi, dimanche);
  const homelies = useHomeliesQuery();
  const pretres = usePretresQuery();
  const importer = useImporterLiturgieMutation();

  const semaine = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ajouterJours(lundi, i)),
    [lundi],
  );

  const homelieParDate = useMemo(() => {
    const m = new Map<string, IHomelieAdmin>();

    // La liste arrive du plus récent au plus ancien : on garde la première par date.
    for (const h of homelies.data ?? []) {
      const d = h.date.slice(0, 10);

      if (!m.has(d)) m.set(d, h);
    }

    return m;
  }, [homelies.data]);

  const jourParDate = useMemo(() => {
    const m = new Map<string, IJourLiturgique>();

    for (const j of jours.data ?? []) m.set(j.date.slice(0, 10), j);

    return m;
  }, [jours.data]);

  const changerSemaine = (decalage: number) => {
    const nouveau = ajouterJours(lundi, decalage * 7);

    setLundi(nouveau);
    setChoisi(nouveau);
  };

  const homelie = homelieParDate.get(choisi);
  const etat = etatHomelie(homelie);

  return (
    <>
      <EnTeteAdmin
        actions={
          peutEcrire && (
            <BoutonAdmin
              isPending={importer.isPending}
              variante="contour"
              onPress={() =>
                importer.mutate(
                  { date: lundi, days: 7 },
                  { onSuccess: () => setImporte(true) },
                )
              }
            >
              {importer.isPending
                ? "Import en cours…"
                : importe
                  ? "Import relancé — à jour"
                  : "Relancer l’import AELF"}
            </BoutonAdmin>
          )
        }
        sousTitre="Textes importés automatiquement depuis l’AELF chaque nuit ; homélie saisie par les prêtres"
        titre="Parole du jour et homélie"
      />
      <ContenuAdmin className="gap-[18px] md:py-[22px]">
        <LectureSeule visible={!peutEcrire} />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 text-[13px] text-gris">
            <button
              aria-label="Semaine précédente"
              className="inline-flex min-h-9 items-center gap-1 rounded-admin px-2 hover:bg-white hover:text-marine"
              type="button"
              onClick={() => changerSemaine(-1)}
            >
              <ChevronLeft aria-hidden className="size-4" />
              <span className="hidden sm:inline">Semaine précédente</span>
            </button>
            <span className="text-center font-semibold text-encre-douce">
              {libelleSemaine(lundi)}
            </span>
            <button
              aria-label="Semaine suivante"
              className="inline-flex min-h-9 items-center gap-1 rounded-admin px-2 hover:bg-white hover:text-marine"
              type="button"
              onClick={() => changerSemaine(1)}
            >
              <span className="hidden sm:inline">Semaine suivante</span>
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </div>
          <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <div
              aria-label="Jours de la semaine"
              className="grid min-w-[560px] grid-cols-7 gap-2"
              role="tablist"
            >
              {semaine.map((d) => {
                const on = d === choisi;
                const e = ETATS_HOMELIE[etatHomelie(homelieParDate.get(d))];

                return (
                  <button
                    key={d}
                    aria-selected={on}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-admin py-2.5 text-encre",
                      on
                        ? "border-2 border-marine bg-selection-admin"
                        : "border border-bord-admin bg-white hover:border-champ",
                    )}
                    role="tab"
                    type="button"
                    onClick={() => setChoisi(d)}
                  >
                    <span className="text-xs">
                      {jourCourt(d)}
                      {d === aujourdhui && (
                        <span className="sr-only"> (aujourd’hui)</span>
                      )}
                    </span>
                    <span className="font-heading text-xl font-bold">
                      {Number(d.slice(8, 10))}
                    </span>
                    {homelies.isLoading ? (
                      <span className="h-[19px]" />
                    ) : (
                      <Pastille
                        className="rounded-[10px] px-2 py-0.5 text-[11px]"
                        ton={e.ton}
                      >
                        {e.court}
                      </Pastille>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {homelies.isError && (
          <ErreurChargement
            message={`Les homélies n’ont pas pu être chargées. ${messageErreur(homelies.error)}`}
            onReessayer={() => homelies.refetch()}
          />
        )}

        <div className="grid grid-cols-1 items-start gap-[22px] xl:grid-cols-[420px_minmax(0,1fr)]">
          <CarteTextesAelf
            key={`${choisi}-${jourParDate.get(choisi)?.feast_override ?? ""}-${jourParDate.get(choisi)?.color_override ?? ""}`}
            chargement={jours.isLoading}
            date={choisi}
            erreur={jours.isError ? messageErreur(jours.error) : null}
            jour={jourParDate.get(choisi) ?? null}
            peutEcrire={peutEcrire}
            onReessayer={() => jours.refetch()}
          />
          {homelies.isLoading ? (
            <section className="rounded-admin border border-bord-admin bg-white px-[26px] py-[22px] text-sm text-gris">
              Chargement de l’homélie…
            </section>
          ) : (
            <FormulaireHomelie
              key={`${choisi}-${homelie?.id ?? "nouvelle"}`}
              date={choisi}
              etat={etat}
              homelie={homelie}
              peutEcrire={peutEcrire && !homelies.isError}
              pretres={pretres.data ?? []}
              pretresEnErreur={pretres.isError}
            />
          )}
        </div>
      </ContenuAdmin>
    </>
  );
}
