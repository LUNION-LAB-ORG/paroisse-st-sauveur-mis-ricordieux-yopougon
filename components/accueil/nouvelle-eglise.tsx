import type {
  IPhaseStatut,
  IProjetEglise,
} from "@/features/projet-eglise/types/projet-eglise.type";

import { ProgressBar } from "@heroui/react";
import Link from "next/link";

import { DonRapide } from "./don-rapide";
import { EmplacementImage } from "./emplacement-image";
import { EnTeteSection } from "./en-tete-section";
import { GalerieChantier } from "./galerie-chantier";

import { CONTENEUR, formatMontant } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const LIBELLE_STATUT: Record<IPhaseStatut, string> = {
  done: "Terminée",
  in_progress: "En cours",
  upcoming: "À venir",
};

interface NouvelleEgliseProps {
  projet: IProjetEglise | null;
  vueEglise: string | null;
  montants: number[];
  projetDon: string;
  logo: string;
}

/** Jauge de collecte (sur fond marine). */
export function Jauge({
  projet,
  compacte = false,
}: {
  projet: IProjetEglise;
  compacte?: boolean;
}) {
  const aUnObjectif = projet.goal_amount > 0;

  return (
    <ProgressBar
      aria-label="Avancement de la collecte"
      className={cn(
        "flex flex-col gap-3",
        !compacte && "border-t border-marine-line pt-6",
      )}
      value={projet.progress}
    >
      <div className="flex items-baseline justify-between">
        <span
          className={cn(
            "font-heading leading-none",
            compacte ? "text-[44px] font-bold" : "text-[64px] font-semibold",
          )}
        >
          {projet.progress} %
        </span>
        <span className="text-sm text-brume lg:text-[15px]">de l’objectif</span>
      </div>
      <ProgressBar.Track className="h-1 rounded-none bg-marine-line">
        <ProgressBar.Fill className="rounded-none bg-ciel" />
      </ProgressBar.Track>
      <div className="flex justify-between gap-4 text-sm text-brume lg:text-[15px]">
        <span>{formatMontant(projet.collected_amount)} FCFA collectés</span>
        {aUnObjectif && (
          <span>Objectif {formatMontant(projet.goal_amount)} FCFA</span>
        )}
      </div>
    </ProgressBar>
  );
}

export function NouvelleEglise({
  projet,
  vueEglise,
  montants,
  projetDon,
  logo,
}: NouvelleEgliseProps) {
  const image = projet?.image ?? vueEglise;

  return (
    <section
      className="mt-8 scroll-mt-4 bg-marine text-white lg:mt-0"
      id="eglise"
    >
      <div
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-4 py-[30px] lg:grid-cols-12 lg:gap-x-6 lg:py-[100px]",
        )}
      >
        <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-[22px] lg:pr-10">
          <EnTeteSection
            surFondMarine
            numero="03"
            surtitre="Projet paroissial"
            titre={projet?.title ?? "Construction de la nouvelle église"}
            titreClassName="text-2xl lg:text-[44px]"
          />
          {projet?.presentation && (
            <p className="m-0 hidden whitespace-pre-line text-lg leading-[1.65] text-brume lg:line-clamp-6">
              {projet.presentation}
            </p>
          )}
          <Link
            className="flex min-h-11 items-center self-start text-[15px] font-bold text-ciel hover:text-white"
            href="/nouvelle-eglise"
          >
            Découvrir le projet et suivre le chantier
          </Link>

          {/* Mobile : la jauge vient juste sous le titre */}
          {projet && (
            <div className="lg:hidden">
              <Jauge compacte projet={projet} />
            </div>
          )}

          <div className="hidden grid-cols-4 gap-2 lg:grid">
            <EmplacementImage
              surFondMarine
              alt="Façade de la future église"
              className="col-span-4 h-[300px] w-full rounded-charte object-[center_75%]"
              libelle="Vue d’architecte de la future église"
              src={image}
            />
            <GalerieChantier photos={projet?.gallery ?? []} />
          </div>

          {projet && projet.phases.length > 0 && (
            <ol
              className="m-0 hidden list-none border-t border-marine-line p-0 lg:grid"
              style={{
                gridTemplateColumns: `repeat(${projet.phases.length}, minmax(0, 1fr))`,
              }}
            >
              {projet.phases.map((ph, i) => (
                <li
                  key={`${ph.name}-${i}`}
                  className={cn(
                    "-mt-0.5 flex flex-col gap-1.5 border-t-[3px] pr-4 pt-[18px]",
                    ph.status === "upcoming"
                      ? "border-transparent"
                      : "border-ciel",
                  )}
                >
                  <span className="text-[13px] text-lavande">
                    Phase {i + 1}
                  </span>
                  <span className="text-base font-semibold">{ph.name}</span>
                  <span
                    className={cn(
                      "text-sm",
                      ph.status === "upcoming" ? "text-lavande" : "text-ciel",
                    )}
                  >
                    {LIBELLE_STATUT[ph.status] ?? ph.status}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex flex-col gap-[26px] lg:col-span-5 lg:col-start-8">
          {projet && (
            <div className="hidden lg:block">
              <Jauge projet={projet} />
            </div>
          )}
          <DonRapide logo={logo} montants={montants} projet={projetDon} />
        </div>
      </div>
    </section>
  );
}
