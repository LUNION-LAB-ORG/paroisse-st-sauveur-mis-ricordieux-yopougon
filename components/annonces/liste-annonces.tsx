"use client";

import type { IAnnonce } from "@/features/annonce/types/annonce.type";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { OngletsFiltre } from "@/components/site/onglets-filtre";
import { jourMoisLong } from "@/lib/charte";
import { cn } from "@/lib/utils";

const TOUTES = "Toutes";

/** Filtres + liste dépliable : une annonce ouverte à la fois, ancre #annonce-{id} partageable. */
export function ListeAnnonces({ annonces }: { annonces: IAnnonce[] }) {
  const [filtre, setFiltre] = useState(TOUTES);
  const [ouverte, setOuverte] = useState<number | null>(null);
  const [copiee, setCopiee] = useState<number | null>(null);

  const categories = useMemo(
    () => [
      TOUTES,
      ...Array.from(new Set(annonces.map((a) => a.category).filter(Boolean))),
    ],
    [annonces],
  );
  const visibles =
    filtre === TOUTES
      ? annonces
      : annonces.filter((a) => a.category === filtre);

  // Ouvre l'annonce ciblée par l'URL (#annonce-12)
  useEffect(() => {
    const m = window.location.hash.match(/^#annonce-(\d+)$/);

    if (m) {
      const id = Number(m[1]);

      setOuverte(id);
      requestAnimationFrame(() =>
        document
          .getElementById(`annonce-${id}`)
          ?.scrollIntoView({ block: "start" }),
      );
    }
  }, []);

  const basculer = (id: number) => {
    const suivante = ouverte === id ? null : id;

    setOuverte(suivante);
    window.history.replaceState(
      null,
      "",
      suivante ? `#annonce-${suivante}` : window.location.pathname,
    );
  };

  const partager = async (a: IAnnonce) => {
    const url = `${window.location.origin}/annonces#annonce-${a.id}`;

    try {
      if (navigator.share) await navigator.share({ title: a.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopiee(a.id);
      }
    } catch {
      /* partage annulé */
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {categories.length > 2 && (
        <OngletsFiltre
          className="overflow-x-auto"
          label="Filtrer les annonces"
          valeur={filtre}
          valeurs={categories}
          onChange={(v) => {
            setFiltre(v);
            setOuverte(null);
          }}
        />
      )}

      {visibles.length === 0 ? (
        <p className="m-0 py-6 text-base text-gris">
          Aucune annonce dans cette catégorie.
        </p>
      ) : (
        <ul className="m-0 list-none p-0">
          {visibles.map((a) => {
            const estOuverte = ouverte === a.id;

            return (
              <li
                key={a.id}
                className="scroll-mt-4 border-b border-ligne"
                id={`annonce-${a.id}`}
              >
                <button
                  aria-controls={`annonce-${a.id}-texte`}
                  aria-expanded={estOuverte}
                  className="flex w-full items-center gap-3 py-[22px] text-left text-encre md:grid md:grid-cols-[130px_150px_minmax(0,1fr)_32px] md:gap-0"
                  type="button"
                  onClick={() => basculer(a.id)}
                >
                  <span className="flex min-w-0 grow flex-col gap-1 md:contents">
                    <span className="flex gap-3 md:contents">
                      <span className="text-[15px] text-gris">
                        {jourMoisLong(a.visible_from ?? a.created_at)}
                      </span>
                      <span className="text-[13px] font-bold text-rouge md:self-center">
                        {a.category}
                      </span>
                    </span>
                    <span className="font-heading text-[17px] font-bold text-marine md:text-lg">
                      {a.title}
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "size-[18px] shrink-0 text-marine transition-transform md:justify-self-end",
                      estOuverte && "rotate-180",
                    )}
                    strokeWidth={2.2}
                  />
                </button>
                {estOuverte && (
                  <div
                    className="flex flex-col gap-3.5 pb-[26px] md:pl-[280px]"
                    id={`annonce-${a.id}-texte`}
                  >
                    <p className="m-0 whitespace-pre-line text-base leading-[1.65] text-[#2C2C36] lg:text-[17px]">
                      {a.content}
                    </p>
                    <div className="flex flex-wrap gap-5 text-[15px]">
                      {a.contact && (
                        <span className="text-gris">Contact : {a.contact}</span>
                      )}
                      <button
                        className="min-h-11 font-bold text-rouge hover:text-rouge-hover md:min-h-0"
                        type="button"
                        onClick={() => partager(a)}
                      >
                        {copiee === a.id ? "Lien copié" : "Partager"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
