"use client";

import type { IPretre } from "@/features/pretre/types/pretre.type";

import { useState } from "react";

import { EmplacementImage } from "@/components/accueil/emplacement-image";
import { cn } from "@/lib/utils";

/** Cartes des autres prêtres + fiche dépliable sous la grille. */
export function Vicaires({ pretres }: { pretres: IPretre[] }) {
  const [choisi, setChoisi] = useState<number | null>(pretres[0]?.id ?? null);
  const detail = pretres.find((p) => p.id === choisi) ?? null;

  return (
    <>
      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
        {pretres.map((p) => {
          const actif = p.id === choisi;

          return (
            <li
              key={p.id}
              className={cn(
                "flex flex-col border border-ligne bg-white",
                actif && "border-t-[3px] border-t-rouge",
              )}
            >
              <EmplacementImage
                alt={`Portrait : ${p.fullname}`}
                className="h-[300px] w-full lg:h-[340px]"
                libelle="Portrait"
                src={p.photo}
              />
              <div className="flex flex-col gap-2 px-6 pb-6 pt-[22px]">
                <span className="text-[13px] font-bold text-rouge">
                  {p.function}
                </span>
                <span className="font-heading text-xl font-bold text-marine lg:text-[21px]">
                  {p.fullname}
                </span>
                {p.missions && (
                  <span className="text-[15px] leading-[1.5] text-encre-douce">
                    {p.missions}
                  </span>
                )}
                <button
                  aria-expanded={actif}
                  className="mt-1.5 min-h-11 self-start py-1 text-[15px] font-bold text-rouge underline underline-offset-4 hover:text-rouge-hover"
                  type="button"
                  onClick={() => setChoisi(actif ? null : p.id)}
                >
                  {actif ? "Fermer le profil" : "Voir le profil"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {detail && (
        <div
          aria-label={`Profil : ${detail.fullname}`}
          className="grid grid-cols-1 gap-8 border border-ligne bg-white p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:px-10 lg:py-9"
          role="region"
        >
          <div className="flex flex-col gap-3.5">
            <span className="text-[13px] font-bold text-rouge">
              {detail.function}
            </span>
            <span className="font-heading text-2xl font-extrabold text-marine lg:text-[30px]">
              {detail.fullname}
            </span>
            <p className="m-0 whitespace-pre-line text-base leading-[1.7] text-[#2C2C36] lg:text-[17px]">
              {detail.biography || "Biographie à venir."}
            </p>
          </div>
          <div className="flex flex-col gap-3 border-ligne lg:border-l lg:pl-8">
            {detail.missions && (
              <>
                <span className="text-[13px] text-gris">Missions confiées</span>
                <span className="text-base font-semibold">
                  {detail.missions}
                </span>
              </>
            )}
            {detail.ordination_year && (
              <>
                <span className="text-[13px] text-gris">Ordonné prêtre</span>
                <span className="text-base font-semibold">
                  {detail.ordination_year}
                </span>
              </>
            )}
            <a
              className="mt-2 rounded-charte bg-marine px-5 py-[13px] text-center text-[15px] font-bold text-white hover:bg-marine-deep hover:text-white hover:no-underline"
              href={`#rdv?pretre=${detail.id}`}
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(
                  new CustomEvent("rdv:pretre", { detail: detail.id }),
                );
                document
                  .getElementById("rdv")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Prendre rendez-vous
            </a>
          </div>
        </div>
      )}
    </>
  );
}
