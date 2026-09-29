import type { IPretre } from "@/features/pretre/types/pretre.type";

import Link from "next/link";

import { EmplacementImage } from "./emplacement-image";
import { EnTeteSection } from "./en-tete-section";

import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";

export function EquipePresbyterale({ pretres }: { pretres: IPretre[] }) {
  return (
    <section
      className="border-y border-ligne bg-white lg:mb-[90px]"
      id="equipe"
    >
      <div
        className={cn(
          CONTENEUR,
          "flex flex-col gap-8 py-8 lg:gap-10 lg:pb-[90px] lg:pt-[100px]",
        )}
      >
        <div className="flex items-end justify-between gap-4">
          <EnTeteSection
            numero="07"
            surtitre="Équipe presbytérale"
            titre="Les prêtres au service de la paroisse"
          />
          <Link
            className="hidden shrink-0 text-[15px] font-bold text-rouge hover:text-rouge-hover lg:inline"
            href="/equipes"
          >
            Toute l’équipe pastorale
          </Link>
        </div>

        {pretres.length === 0 ? (
          <p className="m-0 text-base text-gris">
            L’équipe presbytérale sera bientôt présentée ici.
          </p>
        ) : (
          <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-8 p-0 lg:grid-cols-4 lg:gap-6">
            {pretres.map((p) => (
              <li key={p.id} className="flex flex-col gap-3">
                <EmplacementImage
                  alt={`Portrait : ${p.fullname}`}
                  className="h-[220px] w-full lg:h-[340px]"
                  libelle="Portrait"
                  src={p.photo}
                />
                <span className="text-[13px] font-bold text-rouge">
                  {p.function}
                </span>
                <span className="font-heading text-base font-bold text-marine lg:text-xl">
                  {p.fullname}
                </span>
                {p.missions && (
                  <span className="text-sm leading-[1.5] text-encre-douce lg:text-[15px]">
                    {p.missions}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col items-start justify-between gap-4 border-t border-ligne pt-[26px] lg:flex-row lg:items-center">
          <span className="text-base text-encre-douce lg:text-lg">
            Confession, accompagnement spirituel, préparation au mariage : un
            prêtre vous reçoit.
          </span>
          <Link
            className="w-full rounded-charte bg-marine px-6 py-[15px] text-center text-[15px] font-bold text-white hover:bg-marine-deep hover:text-white hover:no-underline lg:w-auto"
            href="/ecoute"
          >
            Prendre rendez-vous avec un prêtre
          </Link>
        </div>
      </div>
    </section>
  );
}
