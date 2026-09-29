import Link from "next/link";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

export interface IEtapeFil {
  label: string;
  href?: string;
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
                className={cn(derniere && !surFondMarine && "text-encre")}
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
