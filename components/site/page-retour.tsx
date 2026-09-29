import Link from "next/link";

import { CONTENEUR, LOGO_PAR_DEFAUT } from "@/lib/charte";
import { cn } from "@/lib/utils";

export interface IActionRetour {
  label: string;
  href: string;
}

interface PageRetourProps {
  etat: "succes" | "erreur" | "attente";
  surtitre: string;
  titre: string;
  children?: React.ReactNode;
  actions?: IActionRetour[];
}

/**
 * Page de retour (paiement Wave, inscription, demande) aux couleurs de la
 * charte : carte blanche, pastille d'état, actions principale et secondaire.
 */
export function PageRetour({
  etat,
  surtitre,
  titre,
  children,
  actions = [],
}: PageRetourProps) {
  return (
    <section className={cn(CONTENEUR, "py-12 lg:py-20")}>
      <div
        aria-busy={etat === "attente"}
        className={cn(
          "mx-auto flex max-w-[760px] flex-col items-start gap-5 border border-t-4 border-ligne bg-white p-6 lg:px-11 lg:py-10",
          etat === "erreur" ? "border-t-rouge" : "border-t-marine",
        )}
        role={etat === "attente" ? "status" : undefined}
      >
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            aria-hidden
            alt=""
            className="size-16 rounded-full object-cover lg:size-[84px]"
            src={LOGO_PAR_DEFAUT}
          />
          <span
            aria-hidden
            className={cn(
              "flex size-11 items-center justify-center rounded-full text-xl font-bold",
              etat === "succes" && "bg-marine text-white",
              etat === "erreur" && "bg-rouge text-white",
              etat === "attente" &&
                "animate-spin border-4 border-brume border-t-marine",
            )}
          >
            {etat === "succes" ? "✓" : etat === "erreur" ? "!" : ""}
          </span>
        </div>
        <span className="text-sm font-bold text-rouge">{surtitre}</span>
        <h1 className="m-0 font-heading text-[28px] font-extrabold leading-[1.15] text-marine lg:text-[36px]">
          {titre}
        </h1>
        {children && (
          <div className="flex flex-col gap-3 text-base leading-[1.6] text-encre-douce lg:text-[17px]">
            {children}
          </div>
        )}
        {actions.length > 0 && (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {actions.map((a, i) => (
              <Link
                key={a.href + a.label}
                className={cn(
                  "rounded-charte px-[26px] text-center text-base font-bold hover:no-underline",
                  i === 0
                    ? "bg-rouge py-4 text-white hover:bg-rouge-hover hover:text-white"
                    : "border border-marine py-[15px] text-marine hover:text-marine",
                )}
                href={a.href}
              >
                {a.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
