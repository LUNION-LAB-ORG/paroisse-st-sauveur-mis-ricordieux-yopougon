"use client";

import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface ListeReordonnableProps<T> {
  elements: T[];
  cle: (e: T) => number;
  rendu: (e: T, index: number) => React.ReactNode;
  /** Appelé avec le nouvel ordre après un déplacement */
  onReordonner: (ordre: T[]) => void;
  selection?: number | null;
  onChoisir?: (e: T) => void;
  isDisabled?: boolean;
  label: string;
}

/**
 * « Glisser pour changer l'ordre d'affichage » : glisser-déposer natif, et
 * boutons Monter / Descendre pour le clavier et les écrans tactiles.
 */
export function ListeReordonnable<T>({
  elements,
  cle,
  rendu,
  onReordonner,
  selection,
  onChoisir,
  isDisabled,
  label,
}: ListeReordonnableProps<T>) {
  const [glisse, setGlisse] = useState<number | null>(null);
  const [survol, setSurvol] = useState<number | null>(null);

  const deplacer = (de: number, vers: number) => {
    if (vers < 0 || vers >= elements.length || de === vers) return;
    const copie = [...elements];
    const [e] = copie.splice(de, 1);

    copie.splice(vers, 0, e);
    onReordonner(copie);
  };

  return (
    <ul aria-label={label} className="m-0 flex list-none flex-col p-0">
      {elements.map((e, i) => {
        const id = cle(e);
        const choisi = selection === id;

        return (
          <li
            key={id}
            className={cn(
              "flex items-stretch border-t border-ligne-admin first:border-t-0",
              choisi && "bg-selection-admin",
              survol === i && glisse !== i && "border-t-2 border-t-marine",
              glisse === i && "opacity-50",
            )}
            draggable={!isDisabled}
            onDragEnd={() => {
              setGlisse(null);
              setSurvol(null);
            }}
            onDragLeave={() => setSurvol(null)}
            onDragOver={(ev) => {
              ev.preventDefault();
              setSurvol(i);
            }}
            onDragStart={() => setGlisse(i)}
            onDrop={(ev) => {
              ev.preventDefault();
              if (glisse !== null) deplacer(glisse, i);
              setGlisse(null);
              setSurvol(null);
            }}
          >
            {!isDisabled && (
              <span
                aria-hidden
                className="flex cursor-grab items-center pl-2 text-champ active:cursor-grabbing"
              >
                <GripVertical className="size-4" />
              </span>
            )}
            <button
              aria-current={choisi || undefined}
              className="min-w-0 grow px-3 py-3 text-left hover:bg-entete-admin"
              type="button"
              onClick={onChoisir ? () => onChoisir(e) : undefined}
            >
              {rendu(e, i)}
            </button>
            {!isDisabled && (
              <span className="flex flex-col justify-center pr-1.5">
                <button
                  aria-label="Monter"
                  className="rounded p-1 text-gris hover:text-marine disabled:opacity-25"
                  disabled={i === 0}
                  type="button"
                  onClick={() => deplacer(i, i - 1)}
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  aria-label="Descendre"
                  className="rounded p-1 text-gris hover:text-marine disabled:opacity-25"
                  disabled={i === elements.length - 1}
                  type="button"
                  onClick={() => deplacer(i, i + 1)}
                >
                  <ChevronDown className="size-4" />
                </button>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
