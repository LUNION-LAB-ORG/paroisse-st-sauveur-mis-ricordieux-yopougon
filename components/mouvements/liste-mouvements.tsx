"use client";

import type { IService } from "@/features/service/types/service.type";

import Link from "next/link";
import { useMemo, useState } from "react";

import { EmplacementImage } from "@/components/accueil/emplacement-image";
import { OngletsFiltre } from "@/components/site/onglets-filtre";

const TOUS = "Tous";

/** Cartes des mouvements, filtrables par catégorie (même principe que l'accueil). */
export function ListeMouvements({ mouvements }: { mouvements: IService[] }) {
  const [filtre, setFiltre] = useState(TOUS);
  const categories = useMemo(
    () => [
      TOUS,
      ...Array.from(
        new Set(
          mouvements.map((m) => m.category).filter((c): c is string => !!c),
        ),
      ),
    ],
    [mouvements],
  );
  const visibles =
    filtre === TOUS
      ? mouvements
      : mouvements.filter((m) => m.category === filtre);

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      {categories.length > 2 && (
        <div className="min-w-0 overflow-x-auto">
          <OngletsFiltre
            label="Filtrer les mouvements par catégorie"
            valeur={filtre}
            valeurs={categories}
            onChange={setFiltre}
          />
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {visibles.length} mouvement{visibles.length > 1 ? "s" : ""} affiché
        {visibles.length > 1 ? "s" : ""}
      </p>
      <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-3 maquette:grid-cols-4">
        {visibles.map((m) => (
          <li key={m.id} className="min-w-0">
            <Link
              className="group flex h-full flex-col gap-2.5 border-t-[3px] border-marine pt-5 text-encre hover:border-rouge hover:text-encre hover:no-underline"
              href={`/vie-paroissiale/${m.id}`}
            >
              <EmplacementImage
                alt={`Photo du groupe ${m.title}`}
                className="mb-2 h-[190px] w-full"
                libelle="Photo du groupe"
                src={m.image}
              />
              <span className="text-[13px] font-bold text-rouge">
                {[m.category, m.audience].filter(Boolean).join(" · ")}
              </span>
              <span className="break-words font-heading text-[22px] font-semibold leading-[1.15] text-marine group-hover:underline group-hover:underline-offset-4 lg:text-[25px]">
                {m.title}
              </span>
              <span className="text-[15px] leading-[1.55] text-encre-douce">
                {m.description}
              </span>
              {m.schedule && (
                <span className="text-sm text-gris">
                  Rencontres : {m.schedule}
                </span>
              )}
              <span className="mt-auto pt-2 text-[15px] font-bold text-rouge underline underline-offset-4">
                Voir la fiche
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
