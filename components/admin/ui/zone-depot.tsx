"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ZoneDepotProps {
  /** Texte principal (« Glissez une photo ici ou parcourez ») */
  libelle?: string;
  /** Formats acceptés affichés (« JPG ou PNG, redimensionnée automatiquement ») */
  aide?: string;
  accept?: string;
  multiple?: boolean;
  onFichiers: (fichiers: File[]) => void;
  /** Aperçu (image actuelle) */
  apercu?: string | null;
  className?: string;
  enCours?: boolean;
  /** Taille maximale en Mo (contrôle côté navigateur) */
  maxMo?: number;
}

/** Zone de dépôt en pointillés de la maquette. */
export function ZoneDepot({
  libelle = "Glissez un fichier ici ou parcourez",
  aide,
  accept = "image/jpeg,image/png,image/webp",
  multiple,
  onFichiers,
  apercu,
  className,
  enCours,
  maxMo = 5,
}: ZoneDepotProps) {
  const entree = useRef<HTMLInputElement>(null);
  const [survol, setSurvol] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const recevoir = (liste: FileList | null) => {
    const fichiers = Array.from(liste ?? []);
    const tropGros = fichiers.find((f) => f.size > maxMo * 1024 * 1024);

    if (tropGros) {
      setErreur(`« ${tropGros.name} » dépasse ${maxMo} Mo.`);

      return;
    }
    setErreur(null);
    if (fichiers.length) onFichiers(multiple ? fichiers : fichiers.slice(0, 1));
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <button
        className={cn(
          "relative flex min-h-[120px] w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-admin border-2 border-dashed p-4 text-center text-sm",
          survol
            ? "border-marine bg-selection-admin"
            : "border-champ bg-entete-admin",
        )}
        type="button"
        onClick={() => entree.current?.click()}
        onDragLeave={() => setSurvol(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setSurvol(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setSurvol(false);
          recevoir(e.dataTransfer.files);
        }}
      >
        {apercu ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            className="absolute inset-0 size-full object-cover opacity-30"
            src={apercu}
          />
        ) : null}
        <Upload aria-hidden className="relative size-5 text-marine" />
        <span className="relative font-semibold text-encre">
          {enCours ? "Envoi en cours…" : libelle}
        </span>
        {aide && <span className="relative text-[13px] text-gris">{aide}</span>}
      </button>
      <input
        ref={entree}
        accept={accept}
        className="sr-only"
        multiple={multiple}
        tabIndex={-1}
        type="file"
        onChange={(e) => recevoir(e.target.files)}
      />
      {erreur && <span className="text-[13px] text-rouge">{erreur}</span>}
    </div>
  );
}
