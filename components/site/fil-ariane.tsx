import Link from "next/link";
import { Fragment } from "react";

import { DonneesStructurees } from "./donnees-structurees";

import { URL_SITE } from "@/lib/charte";
import { cn } from "@/lib/utils";

export interface IEtapeFil {
  label: string;
  href?: string;
}

/**
 * Fil d'Ariane schema.org : seules les étapes qui ont une adresse (et la page
 * courante, en dernier) y figurent.
 */
function filStructure(etapes: IEtapeFil[]) {
  const retenues = etapes.filter(
    (e, i) => i === etapes.length - 1 || (e.href && !e.href.startsWith("#")),
  );

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: retenues.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.label,
      ...(e.href && i < retenues.length - 1
        ? { item: `${URL_SITE}${e.href === "/" ? "" : e.href}` }
        : {}),
    })),
  };
}

/** Fil d'Ariane des sous-pages (« Accueil / Communauté / Chantier »). */
export function FilAriane({
  etapes,
  surFondMarine = false,
}: {
  etapes: IEtapeFil[];
  surFondMarine?: boolean;
}) {
  return (
    <nav
      aria-label="Fil d’Ariane"
      className={cn(
        "flex flex-wrap gap-2 text-sm",
        surFondMarine ? "text-lavande" : "text-gris",
      )}
    >
      <DonneesStructurees donnees={filStructure(etapes)} />
      {etapes.map((e, i) => {
        const derniere = i === etapes.length - 1;

        return (
          <Fragment key={`${e.label}-${i}`}>
            {i > 0 && <span aria-hidden>/</span>}
            {e.href && !derniere ? (
              <Link
                className={cn(
                  "hover:underline",
                  surFondMarine
                    ? "text-brume hover:text-white"
                    : "text-rouge hover:text-rouge-hover",
                )}
                href={e.href}
              >
                {e.label}
              </Link>
            ) : (
              <span
                aria-current={derniere ? "page" : undefined}
                className={cn(
                  "min-w-0 break-words",
                  derniere && !surFondMarine && "text-encre",
                )}
              >
                {e.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
