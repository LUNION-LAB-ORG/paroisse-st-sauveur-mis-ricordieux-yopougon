"use client";

import type { IService } from "@/features/service/types/service.type";

import { Button, Tabs } from "@heroui/react";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { EmplacementImage } from "./emplacement-image";
import { EnTeteSection } from "./en-tete-section";

import {
  BoutonsMouvement,
  InfosMouvement,
  surtitreMouvement,
} from "@/components/mouvements/infos-mouvement";
import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";

const TOUS = "Tous";

function Fiche({
  mouvement,
  onFermer,
}: {
  mouvement: IService;
  onFermer: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [mouvement.id]);

  return (
    <div
      ref={ref}
      aria-label={`Fiche : ${mouvement.title}`}
      className="grid grid-cols-1 border border-ligne bg-white lg:grid-cols-[400px_minmax(0,1fr)]"
      role="region"
    >
      <EmplacementImage
        alt={`Photo du groupe ${mouvement.title}`}
        className="h-[220px] w-full lg:h-full lg:min-h-[420px]"
        libelle="Photo du groupe"
        src={mouvement.image}
      />
      <div className="flex flex-col gap-5 p-5 lg:px-12 lg:py-11">
        <div className="flex items-start justify-between gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-bold text-rouge">
              {surtitreMouvement(mouvement)}
            </span>
            <span className="font-heading text-[28px] font-semibold leading-[1.05] text-marine lg:text-[40px]">
              {mouvement.title}
            </span>
          </div>
          <Button
            isIconOnly
            aria-label="Fermer la fiche"
            className="size-11 min-w-11 shrink-0 rounded-charte border border-ligne bg-white"
            variant="ghost"
            onPress={onFermer}
          >
            <X aria-hidden className="size-4 text-marine" strokeWidth={2} />
          </Button>
        </div>
        {mouvement.content && (
          <p className="m-0 whitespace-pre-line text-[17px] leading-[1.7] text-[#2C2C36]">
            {mouvement.content}
          </p>
        )}
        <InfosMouvement mouvement={mouvement} />
        <BoutonsMouvement mouvement={mouvement} />
        <Link
          className="self-start text-[15px] font-bold text-rouge hover:text-rouge-hover"
          href={`/vie-paroissiale/${mouvement.id}`}
        >
          Voir la fiche complète
        </Link>
      </div>
    </div>
  );
}

export function Mouvements({ mouvements }: { mouvements: IService[] }) {
  const [filtre, setFiltre] = useState(TOUS);
  const [ouvert, setOuvert] = useState<number | null>(null);

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
  const filtres =
    filtre === TOUS
      ? mouvements
      : mouvements.filter((m) => m.category === filtre);
  const choisi = mouvements.find((m) => m.id === ouvert) ?? null;

  return (
    <section className="scroll-mt-4" id="vie">
      <div
        className={cn(
          CONTENEUR,
          "flex flex-col gap-2 pb-2.5 pt-8 lg:gap-9 lg:pb-[90px] lg:pt-[100px]",
        )}
      >
        <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-12 lg:gap-x-6">
          <EnTeteSection
            className="lg:col-span-6"
            numero="04"
            surtitre="Vie paroissiale"
            titre="Mouvements et groupes"
          />
          {categories.length > 2 && (
            <Tabs
              className="tabs-charte hidden lg:col-span-6 lg:col-start-7 lg:flex"
              selectedKey={filtre}
              variant="secondary"
              onSelectionChange={(k) => {
                setFiltre(String(k));
                setOuvert(null);
              }}
            >
              <Tabs.ListContainer>
                <Tabs.List
                  aria-label="Filtrer par catégorie"
                  className="justify-end gap-[26px]"
                >
                  {categories.map((c) => (
                    <Tabs.Tab
                      key={c}
                      className="w-auto shrink-0 pb-3.5 pt-2.5 text-base"
                      id={c}
                    >
                      {c}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          )}
        </div>

        {mouvements.length === 0 ? (
          <p className="m-0 border-t border-ligne py-6 text-base text-gris">
            Les mouvements et groupes seront bientôt présentés ici.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {filtres.map((m) => {
              const actif = m.id === ouvert;

              return (
                <div key={m.id} className="contents">
                  <article
                    className={cn(
                      "flex flex-col gap-1 border-t border-ligne py-4 lg:min-h-[250px] lg:gap-2.5 lg:py-0 lg:pt-5",
                      actif
                        ? "lg:border-t-[3px] lg:border-rouge"
                        : "lg:border-marine",
                    )}
                  >
                    <span className="text-xs font-bold text-rouge lg:text-[13px]">
                      {m.category}
                    </span>
                    <h3 className="m-0 font-heading text-[17px] font-bold leading-[1.15] text-marine lg:text-[25px] lg:font-semibold">
                      {m.title}
                    </h3>
                    <p className="m-0 text-[15px] leading-[1.5] text-encre-douce lg:leading-[1.55]">
                      {m.description}
                    </p>
                    {m.schedule && (
                      <span className="hidden text-sm text-gris lg:block">
                        Rencontres : {m.schedule}
                      </span>
                    )}
                    <button
                      aria-expanded={actif}
                      className="mt-auto min-h-11 self-start py-1.5 text-sm font-bold text-rouge underline underline-offset-[3px] hover:text-rouge-hover lg:text-[15px] lg:underline-offset-4"
                      type="button"
                      onClick={() => setOuvert(actif ? null : m.id)}
                    >
                      {actif ? "Fermer la fiche" : "En savoir plus"}
                    </button>
                  </article>
                  {/* Mobile : la fiche s'ouvre sous la carte */}
                  {actif && (
                    <div className="pb-4 lg:hidden">
                      <Fiche mouvement={m} onFermer={() => setOuvert(null)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop : la fiche s'ouvre sous la grille */}
        {choisi && (
          <div className="hidden lg:block">
            <Fiche mouvement={choisi} onFermer={() => setOuvert(null)} />
          </div>
        )}

        <Link
          className="flex min-h-11 items-center self-start text-[15px] font-bold text-rouge hover:text-rouge-hover"
          href="/vie-paroissiale"
        >
          Tous les mouvements et groupes
        </Link>
      </div>
    </section>
  );
}
