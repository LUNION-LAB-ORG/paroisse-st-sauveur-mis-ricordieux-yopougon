"use client";

import type { IEvenementAdmin } from "@/features/evenement/types/evenement-admin.type";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { FicheEvenement } from "./fiche-evenement";
import { OngletInscrits } from "./onglet-inscrits";
import { dateEvenement } from "./utils";

import { moisCourt } from "@/components/admin/contenus/dates";
import { messageErreur } from "@/components/admin/contenus/erreur-api";
import { LectureSeule } from "@/components/admin/contenus/mise-en-page";
import {
  BoutonAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import { useEvenementsAdminQuery } from "@/features/evenement/queries/evenement-admin.query";
import { cn } from "@/lib/utils";

type IOnglet = "details" | "inscrits";

function ElementListe({
  e,
  actif,
  onChoisir,
}: {
  e: IEvenementAdmin;
  actif: boolean;
  onChoisir: () => void;
}) {
  const date = dateEvenement(e);
  const inscrits = e.registrations_count ?? e.participants_count ?? 0;
  const info = [
    e.registrations_open === false
      ? "Sans inscription"
      : `${inscrits} inscrit${inscrits > 1 ? "s" : ""}`,
    e.location_at,
    e.status === "draft"
      ? "Brouillon"
      : e.status === "hidden"
        ? "Masqué"
        : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      aria-current={actif || undefined}
      className={cn(
        "flex w-full items-center gap-3 border-t border-l-[3px] border-t-ligne-admin px-[18px] py-3 text-left text-encre first:border-t-0",
        actif
          ? "border-l-rouge bg-selection-admin"
          : "border-l-transparent bg-white hover:bg-entete-admin",
      )}
      type="button"
      onClick={onChoisir}
    >
      <span className="flex h-14 w-[52px] shrink-0 flex-col items-center justify-center rounded-admin bg-selection-admin text-marine">
        <span className="font-heading text-lg font-extrabold leading-none">
          {date ? Number(date.slice(8, 10)) : "—"}
        </span>
        <span className="text-[11px] font-bold">
          {date ? moisCourt(date) : ""}
        </span>
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-bold">{e.title}</span>
        <span className="text-xs text-gris">{info}</span>
      </span>
    </button>
  );
}

/** Écran « Événements » : agenda, fiche événement et inscriptions. */
export function EcranEvenements() {
  const peutEcrire = useDroits().peutModifier("evenements");
  const params = useSearchParams();
  const router = useRouter();
  const avenir = useEvenementsAdminQuery("upcoming");
  const passes = useEvenementsAdminQuery("past");
  const [choisi, setChoisi] = useState<number | "nouveau" | null>(() => {
    if (params.get("nouveau")) return "nouveau";
    const id = Number(params.get("id"));

    return id > 0 ? id : null;
  });
  const [onglet, setOnglet] = useState<IOnglet>("details");
  const [voirPasses, setVoirPasses] = useState(false);
  const fiche = useRef<HTMLElement>(null);

  const tous = [...(avenir.data ?? []), ...(passes.data ?? [])];
  const courant =
    typeof choisi === "number"
      ? (tous.find((e) => e.id === choisi) ?? null)
      : null;

  useEffect(() => {
    if (choisi === null && avenir.data?.length) setChoisi(avenir.data[0].id);
    else if (choisi === null && avenir.data && passes.data?.length)
      setChoisi(passes.data[0].id);
  }, [choisi, avenir.data, passes.data]);

  // Un événement passé demandé par l'adresse : on déplie la liste des passés.
  useEffect(() => {
    if (typeof choisi === "number" && passes.data?.some((e) => e.id === choisi))
      setVoirPasses(true);
  }, [choisi, passes.data]);

  const choisir = (v: number | "nouveau") => {
    setChoisi(v);
    if (v === "nouveau") setOnglet("details");
    if (params.get("id") || params.get("nouveau"))
      router.replace("/dashboard/evenements", { scroll: false });
    if (typeof window !== "undefined" && window.innerWidth < 1280)
      requestAnimationFrame(() =>
        fiche.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
  };

  const chargement = avenir.isLoading;
  const introuvable =
    typeof choisi === "number" &&
    !courant &&
    !avenir.isLoading &&
    !passes.isLoading;

  return (
    <>
      <EnTeteAdmin
        actions={
          peutEcrire && (
            <BoutonAdmin variante="primaire" onPress={() => choisir("nouveau")}>
              + Nouvel événement
            </BoutonAdmin>
          )
        }
        sousTitre="Agenda du site, fiches événement et inscriptions"
        titre="Événements"
      />
      <ContenuAdmin>
        <LectureSeule visible={!peutEcrire} />
        {avenir.isError && (
          <ErreurChargement
            message={`Les événements n’ont pas pu être chargés. ${messageErreur(avenir.error)}`}
            onReessayer={() => {
              avenir.refetch();
              passes.refetch();
            }}
          />
        )}
        <div className="grid grid-cols-1 items-start gap-[22px] xl:grid-cols-[360px_minmax(0,1fr)]">
          <section className="self-start overflow-hidden rounded-admin border border-bord-admin bg-white">
            <h2 className="m-0 border-b border-bord-admin px-[18px] py-3.5 text-[13px] font-bold text-gris">
              À venir
            </h2>
            {chargement ? (
              <p className="m-0 px-[18px] py-4 text-sm text-gris">
                Chargement…
              </p>
            ) : (avenir.data ?? []).length === 0 ? (
              <p className="m-0 px-[18px] py-4 text-sm text-gris">
                Aucun événement à venir.
              </p>
            ) : (
              <div className="flex flex-col">
                {(avenir.data ?? []).map((e) => (
                  <ElementListe
                    key={e.id}
                    actif={e.id === choisi}
                    e={e}
                    onChoisir={() => choisir(e.id)}
                  />
                ))}
              </div>
            )}
            <button
              aria-expanded={voirPasses}
              className="flex w-full items-center justify-between border-t border-bord-admin px-[18px] py-3.5 text-left text-[13px] font-bold text-gris hover:bg-entete-admin"
              type="button"
              onClick={() => setVoirPasses((v) => !v)}
            >
              Passés
              <span aria-hidden>{voirPasses ? "−" : "+"}</span>
            </button>
            {voirPasses && (
              <div className="flex flex-col border-t border-ligne-admin">
                {passes.isLoading ? (
                  <p className="m-0 px-[18px] py-4 text-sm text-gris">
                    Chargement…
                  </p>
                ) : passes.isError ? (
                  <p className="m-0 px-[18px] py-4 text-sm text-rouge">
                    {messageErreur(passes.error)}
                  </p>
                ) : (passes.data ?? []).length === 0 ? (
                  <p className="m-0 px-[18px] py-4 text-sm text-gris">
                    Aucun événement passé.
                  </p>
                ) : (
                  (passes.data ?? []).map((e) => (
                    <ElementListe
                      key={e.id}
                      actif={e.id === choisi}
                      e={e}
                      onChoisir={() => choisir(e.id)}
                    />
                  ))
                )}
              </div>
            )}
          </section>

          <section
            ref={fiche}
            className="flex min-w-0 scroll-mt-4 flex-col rounded-admin border border-bord-admin bg-white"
          >
            <div
              className="flex gap-[26px] overflow-x-auto border-b border-bord-admin px-5 md:px-6"
              role="tablist"
            >
              {(
                [
                  ["details", "Détails de l’événement"],
                  ["inscrits", "Inscrits"],
                ] as const
              ).map(([id, label]) => {
                const on = onglet === id;
                const inactif = id === "inscrits" && !courant;

                return (
                  <button
                    key={id}
                    aria-selected={on}
                    className={cn(
                      "-mb-px shrink-0 whitespace-nowrap border-b-[3px] bg-transparent pb-3.5 pt-4 text-[15px] disabled:cursor-not-allowed disabled:opacity-40",
                      on
                        ? "border-b-rouge font-bold text-marine"
                        : "border-b-transparent text-gris hover:text-marine",
                    )}
                    disabled={inactif}
                    role="tab"
                    type="button"
                    onClick={() => setOnglet(id)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {introuvable ? (
              <p className="m-0 px-6 py-8 text-sm text-gris">
                Cet événement est introuvable ou a été supprimé.
              </p>
            ) : choisi === null ? (
              <p className="m-0 px-6 py-8 text-sm text-gris">
                {chargement
                  ? "Chargement…"
                  : peutEcrire
                    ? "Aucun événement. Créez le premier avec « + Nouvel événement »."
                    : "Aucun événement."}
              </p>
            ) : onglet === "details" || !courant ? (
              choisi === "nouveau" || courant ? (
                <FicheEvenement
                  key={choisi === "nouveau" ? "nouveau" : courant?.id}
                  evenement={courant}
                  peutEcrire={peutEcrire}
                  onCree={(id) => setChoisi(id)}
                  onSupprime={() => setChoisi(null)}
                />
              ) : (
                <p className="m-0 px-6 py-8 text-sm text-gris">Chargement…</p>
              )
            ) : (
              <OngletInscrits evenement={courant} />
            )}
          </section>
        </div>
      </ContenuAdmin>
    </>
  );
}
