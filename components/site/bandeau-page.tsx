import { FilAriane, type IEtapeFil } from "./fil-ariane";

import { CONTENEUR, LOGO_PAR_DEFAUT } from "@/lib/charte";
import { cn } from "@/lib/utils";

interface BandeauPageProps {
  fil: IEtapeFil[];
  titre: string;
  sousTitre?: React.ReactNode;
  /** Bouton ou lien aligné à droite (ex. « Feuille d'annonces (PDF) ») */
  action?: React.ReactNode;
  /** Logo en filigrane (page Équipe) */
  filigrane?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/** Bandeau marine des sous-pages : fil d'Ariane, titre, sous-titre. */
export function BandeauPage({
  fil,
  titre,
  sousTitre,
  action,
  filigrane,
  children,
  className,
}: BandeauPageProps) {
  return (
    <section
      className={cn("relative overflow-hidden bg-marine text-white", className)}
    >
      {filigrane && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          aria-hidden
          alt=""
          className="pointer-events-none absolute -right-20 -top-[140px] hidden size-[480px] rounded-full opacity-[.06] lg:block"
          src={LOGO_PAR_DEFAUT}
        />
      )}
      <div
        className={cn(
          CONTENEUR,
          "relative flex flex-col gap-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:py-[60px]",
          children && "lg:pb-0",
        )}
      >
        <div className="flex flex-col gap-3.5">
          <FilAriane surFondMarine etapes={fil} />
          <h1 className="m-0 font-heading text-[30px] font-extrabold leading-[1.1] tracking-[-0.015em] lg:text-[46px]">
            {titre}
          </h1>
          {sousTitre && (
            <div className="max-w-[760px] text-base leading-[1.55] text-brume lg:text-[19px]">
              {sousTitre}
            </div>
          )}
        </div>
        {action}
      </div>
      {children && <div className={CONTENEUR}>{children}</div>}
    </section>
  );
}
