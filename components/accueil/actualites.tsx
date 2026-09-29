import type { IActualite } from "@/features/actualite/types/actualite.type";
import type { IEvenement } from "@/features/evenement/types/evenement.type";

import Link from "next/link";

import { EmplacementImage } from "./emplacement-image";
import { EnTeteSection } from "./en-tete-section";

import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";

const formatDate = (iso: string | null | undefined) =>
  iso
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(iso.slice(0, 10)))
    : "";

const jourMois = (iso: string) => {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);

  return {
    jour: String(d.getUTCDate()),
    mois: new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      timeZone: "UTC",
    }).format(d),
  };
};

export function Actualites({
  actualites,
  evenement,
}: {
  actualites: IActualite[];
  evenement: IEvenement | null;
}) {
  if (actualites.length === 0 && !evenement) return null;

  return (
    <section className="mt-8 border-t border-ligne bg-white lg:mt-0" id="actus">
      <div
        className={cn(
          CONTENEUR,
          "flex flex-col gap-6 py-8 lg:gap-9 lg:pb-[90px] lg:pt-[100px]",
        )}
      >
        <div className="flex items-end justify-between gap-4">
          <EnTeteSection
            numero="05"
            surtitre="Actualités"
            titre="La vie de la communauté"
          />
          <Link
            className="hidden shrink-0 text-[15px] font-bold text-rouge hover:text-rouge-hover lg:inline"
            href="/actualites"
          >
            Toutes les publications
          </Link>
        </div>

        {actualites.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-6">
            {actualites.map((a) => (
              <Link
                key={a.id}
                className="group flex flex-col gap-3.5 text-encre hover:text-encre hover:no-underline"
                href={`/actualites/${a.id}`}
              >
                <EmplacementImage
                  alt={a.title}
                  className="h-[220px] w-full lg:h-[250px]"
                  libelle="Photo de la publication"
                  src={a.image}
                />
                <span className="text-[13px] font-bold text-rouge">
                  {a.category}
                  {a.published_at && (
                    <span className="font-normal text-gris">
                      {" "}
                      · {formatDate(a.published_at)}
                    </span>
                  )}
                </span>
                <span className="font-heading text-xl font-semibold leading-[1.2] text-marine group-hover:underline group-hover:underline-offset-4 lg:text-[26px]">
                  {a.title}
                </span>
                {a.new_resume && (
                  <span className="line-clamp-3 text-[15px] leading-[1.55] text-encre-douce">
                    {a.new_resume}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}

        {evenement && (
          <div className="grid grid-cols-1 items-center gap-2 border-t border-ligne pt-[26px] lg:grid-cols-[180px_minmax(0,1fr)_auto] lg:gap-6">
            <span className="text-[13px] font-bold text-rouge">
              Prochain événement
            </span>
            <span className="text-lg">
              <strong className="font-heading text-[22px] font-medium text-marine">
                {jourMois(evenement.date_at).jour}{" "}
                {jourMois(evenement.date_at).mois}
              </strong>{" "}
              — {evenement.title}
            </span>
            <Link
              className="text-[15px] font-bold text-rouge hover:text-rouge-hover"
              href={`/evenement/${evenement.id}`}
            >
              Voir l’événement
            </Link>
          </div>
        )}

        <Link
          className="text-[15px] font-bold text-rouge lg:hidden"
          href="/actualites"
        >
          Toutes les publications
        </Link>
      </div>
    </section>
  );
}
