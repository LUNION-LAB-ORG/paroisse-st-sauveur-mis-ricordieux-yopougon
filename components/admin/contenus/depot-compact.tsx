"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface DepotCompactProps {
  titre: string;
  aide?: string;
  accept: string;
  maxMo: number;
  onFichier: (f: File) => void;
  /** Nom du fichier choisi (affiché à la place de l'aide) */
  choisi?: string | null;
  isDisabled?: boolean;
  className?: string;
}

/** Zone de dépôt compacte en pointillés (« Ajouter l’enregistrement audio · MP3, facultatif »). */
export function DepotCompact({
  titre,
  aide,
  accept,
  maxMo,
  onFichier,
  choisi,
  isDisabled,
  className,
}: DepotCompactProps) {
  const entree = useRef<HTMLInputElement>(null);
  const [survol, setSurvol] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const recevoir = (liste: FileList | null) => {
    const f = liste?.[0];

    if (!f) return;
    if (f.size > maxMo * 1024 * 1024) {
      setErreur(`« ${f.name} » dépasse ${maxMo} Mo.`);

      return;
    }
    setErreur(null);
    onFichier(f);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <button
        className={cn(
          "flex min-h-11 w-full flex-col gap-0.5 rounded-admin border-[1.5px] border-dashed p-3.5 text-left text-sm text-gris disabled:cursor-not-allowed disabled:opacity-60",
          survol ? "border-marine bg-selection-admin" : "border-champ bg-white",
        )}
        disabled={isDisabled}
        type="button"
        onClick={() => entree.current?.click()}
        onDragLeave={() => setSurvol(false)}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDisabled) setSurvol(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setSurvol(false);
          if (!isDisabled) recevoir(e.dataTransfer.files);
        }}
      >
        <span className="font-bold text-marine">{titre}</span>
        <span className="break-all">{choisi ?? aide}</span>
      </button>
      <input
        ref={entree}
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        type="file"
        onChange={(e) => {
          recevoir(e.target.files);
          e.target.value = "";
        }}
      />
      {erreur && <span className="text-[13px] text-rouge">{erreur}</span>}
    </div>
  );
}
