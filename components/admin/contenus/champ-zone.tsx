"use client";

import { useId, useRef } from "react";

import { cn } from "@/lib/utils";

export type IOutilMiseEnForme = "intertitre" | "gras" | "italique" | "citation";

const OUTILS: Record<
  IOutilMiseEnForme,
  { libelle: string; aria: string; className: string }
> = {
  intertitre: {
    libelle: "Intertitre",
    aria: "Intertitre",
    className: "px-1.5 text-[13px] font-bold",
  },
  gras: { libelle: "G", aria: "Gras", className: "w-[30px] font-extrabold" },
  italique: { libelle: "I", aria: "Italique", className: "w-[30px] italic" },
  citation: {
    libelle: "Citation",
    aria: "Citation",
    className: "px-1.5 text-[13px]",
  },
};

interface ChampZoneRicheProps {
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
  /** Affiche « n / max » sous le champ */
  compteur?: boolean;
  aide?: React.ReactNode;
  erreur?: string;
  isDisabled?: boolean;
  /** Barre de mise en forme (insère la syntaxe dans le texte) */
  outils?: IOutilMiseEnForme[];
  /** Libellé de la citation (« Citation biblique ») */
  ariaCitation?: string;
  /** Police des textes liturgiques (EB Garamond 18 px) */
  serif?: boolean;
  className?: string;
}

/**
 * Zone de texte de la maquette, avec barre de mise en forme facultative :
 * « G » insère **gras**, « I » *italique*, « Citation » > citation,
 * « Intertitre » ## intertitre.
 */
export function ChampZoneRiche({
  label,
  value,
  onChange,
  rows = 5,
  placeholder,
  maxLength,
  compteur,
  aide,
  erreur,
  isDisabled,
  outils,
  ariaCitation,
  serif,
  className,
}: ChampZoneRicheProps) {
  const id = useId();
  const zone = useRef<HTMLTextAreaElement>(null);

  const appliquer = (outil: IOutilMiseEnForme) => {
    const el = zone.current;

    if (!el) return;
    const debut = el.selectionStart;
    const fin = el.selectionEnd;
    const choisi = value.slice(debut, fin);
    let insertion: string;
    let curseur: [number, number];

    if (outil === "gras" || outil === "italique") {
      const marque = outil === "gras" ? "**" : "*";
      const texte = choisi || (outil === "gras" ? "texte en gras" : "texte");

      insertion = `${marque}${texte}${marque}`;
      curseur = [debut + marque.length, debut + marque.length + texte.length];
    } else {
      const prefixe = outil === "citation" ? "> " : "## ";
      const texte =
        choisi || (outil === "citation" ? "citation" : "Intertitre");
      const avant = value.slice(0, debut);
      const saut =
        avant && !avant.endsWith("\n\n")
          ? avant.endsWith("\n")
            ? "\n"
            : "\n\n"
          : "";

      insertion = `${saut}${prefixe}${texte}\n\n`;
      curseur = [
        debut + saut.length + prefixe.length,
        debut + saut.length + prefixe.length + texte.length,
      ];
    }
    const suivant = value.slice(0, debut) + insertion + value.slice(fin);

    if (maxLength && suivant.length > maxLength) return;
    onChange(suivant);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(curseur[0], curseur[1]);
    });
  };

  const saisie = (
    <textarea
      ref={zone}
      aria-describedby={erreur || aide ? `${id}-aide` : undefined}
      aria-invalid={!!erreur || undefined}
      className={cn(
        "block w-full resize-y bg-white px-3 py-[11px] text-encre outline-none disabled:cursor-not-allowed disabled:bg-entete-admin disabled:text-gris",
        serif
          ? "font-scripture text-lg leading-[1.6]"
          : "text-[15px] leading-[1.55]",
        outils
          ? "rounded-b-admin border-0 p-3.5"
          : "rounded-admin border border-champ focus:border-marine",
        erreur && !outils && "border-rouge",
      )}
      disabled={isDisabled}
      id={id}
      maxLength={maxLength}
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-bold text-encre" htmlFor={id}>
        {label}
      </label>
      {outils ? (
        <div
          className={cn(
            "rounded-admin border border-champ focus-within:border-marine",
            erreur && "border-rouge",
          )}
        >
          <div
            aria-label="Mise en forme"
            className="flex flex-wrap gap-1 rounded-t-admin border-b border-bord-admin bg-entete-admin px-2 py-1.5"
            role="toolbar"
          >
            {outils.map((o) => (
              <button
                key={o}
                aria-label={
                  o === "citation" && ariaCitation
                    ? ariaCitation
                    : OUTILS[o].aria
                }
                className={cn(
                  "h-[30px] rounded-[3px] border-0 bg-transparent text-encre hover:bg-bord-admin disabled:opacity-40",
                  OUTILS[o].className,
                )}
                disabled={isDisabled}
                type="button"
                onClick={() => appliquer(o)}
              >
                {OUTILS[o].libelle}
              </button>
            ))}
          </div>
          {saisie}
        </div>
      ) : (
        saisie
      )}
      {erreur ? (
        <span className="text-[13px] text-rouge" id={`${id}-aide`}>
          {erreur}
        </span>
      ) : (
        (aide || (compteur && maxLength)) && (
          <span
            className="flex justify-between gap-3 text-[13px] text-gris"
            id={`${id}-aide`}
          >
            <span>{aide}</span>
            {compteur && maxLength && (
              <span className="shrink-0">
                {value.length} / {maxLength}
              </span>
            )}
          </span>
        )
      )}
    </div>
  );
}
