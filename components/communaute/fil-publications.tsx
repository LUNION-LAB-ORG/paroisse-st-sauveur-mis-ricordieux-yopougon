"use client";

import type {
  IPublication,
  IPublicationsPage,
} from "@/features/publication/types/publication.type";

import { Button } from "@heroui/react";
import { useState } from "react";

import { CartePublication } from "./carte-publication";

import { OngletsFiltre } from "@/components/site/onglets-filtre";
import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";
import { publicationAPI } from "@/features/publication/apis/publication.api";

const FILTRES = [
  { label: "Tout", type: "" },
  { label: "Photos", type: "photo" },
  { label: "Vidéos", type: "video" },
  { label: "Textes", type: "text" },
] as const;

interface FilPublicationsProps {
  initial: IPublicationsPage;
  /** Publication à la une, déjà affichée au-dessus du fil */
  exclure?: string;
  /** Titre de la page (à gauche des filtres) */
  enTete: React.ReactNode;
  /** Carte « À la une », entre l'en-tête et le fil */
  aLaUne?: React.ReactNode;
}

/** Filtres par format + fil paginé (« Voir plus » charge 9 publications). */
export function FilPublications({
  initial,
  exclure,
  enTete,
  aLaUne,
}: FilPublicationsProps) {
  const [filtre, setFiltre] = useState<string>("Tout");
  const [items, setItems] = useState<IPublication[]>(initial.data);
  const [page, setPage] = useState(initial.meta.current_page);
  const [dernierePage, setDernierePage] = useState(initial.meta.last_page);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(false);

  const charger = async (label: string, numero: number) => {
    const type = FILTRES.find((f) => f.label === label)?.type ?? "";

    setChargement(true);
    setErreur(false);
    try {
      const res = await publicationAPI.obtenirPage({
        page: String(numero),
        per_page: "9",
        ...(type ? { type } : {}),
        ...(exclure ? { exclude: exclure } : {}),
      });

      setItems((prec) => (numero === 1 ? res.data : [...prec, ...res.data]));
      setPage(res.meta.current_page);
      setDernierePage(res.meta.last_page);
    } catch {
      setErreur(true);
    } finally {
      setChargement(false);
    }
  };

  const changerFiltre = (v: string) => {
    setFiltre(v);
    void charger(v, 1);
  };

  return (
    <>
      <section
        className={cn(
          CONTENEUR,
          "flex flex-col gap-6 pb-[30px] pt-10 lg:flex-row lg:items-end lg:justify-between lg:pt-14",
        )}
      >
        {enTete}
        <OngletsFiltre
          className="shrink-0 self-start lg:self-auto"
          label="Filtrer par format"
          valeur={filtre}
          valeurs={FILTRES.map((f) => f.label)}
          onChange={changerFiltre}
        />
      </section>

      {aLaUne && (
        <section className={cn(CONTENEUR, "pb-12 pt-2.5")}>{aLaUne}</section>
      )}

      <section className={cn(CONTENEUR, "flex flex-col gap-10 pb-16 lg:pb-20")}>
        {items.length === 0 && !chargement ? (
          <p className="m-0 text-base text-gris">
            {filtre === "Tout"
              ? "Aucune publication pour le moment."
              : "Aucune autre publication dans ce format."}
          </p>
        ) : (
          <div
            aria-busy={chargement}
            className="grid grid-cols-1 gap-x-6 gap-y-11 md:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((p) => (
              <CartePublication key={p.id} p={p} />
            ))}
          </div>
        )}

        {erreur && (
          <p className="m-0 text-center text-sm text-rouge">
            Le chargement a échoué. Réessayez.
          </p>
        )}

        {page < dernierePage && (
          <Button
            className="h-auto min-h-11 self-center rounded-charte border border-marine bg-transparent px-[34px] py-[15px] text-base font-bold text-marine"
            isPending={chargement}
            variant="ghost"
            onPress={() => charger(filtre, page + 1)}
          >
            Voir plus de publications
          </Button>
        )}
      </section>
    </>
  );
}
