import type { IJalon } from "@/features/histoire/types/histoire.type";

import Link from "next/link";

import { EmplacementImage } from "./emplacement-image";
import { EnTeteSection } from "./en-tete-section";

import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";

interface HistoireCureProps {
  jalons: IJalon[];
  motDuCure: { message: string; signature: string; photo: string | null };
}

export function HistoireCure({ jalons, motDuCure }: HistoireCureProps) {
  if (jalons.length === 0 && !motDuCure.message) return null;

  return (
    <section className="scroll-mt-4" id="histoire">
      <div
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-12 py-8 lg:grid-cols-12 lg:gap-x-6 lg:py-[100px]",
        )}
      >
        <div className="flex flex-col gap-[18px] lg:col-span-5">
          <EnTeteSection
            numero="06"
            surtitre="Notre histoire"
            titre="Une communauté enracinée à Yopougon"
          />
          {jalons.length > 0 && (
            <ol className="m-0 mt-2.5 flex list-none flex-col p-0">
              {jalons.map((h) => (
                <li
                  key={h.id}
                  className="grid grid-cols-[90px_minmax(0,1fr)] border-t border-ligne py-4 lg:grid-cols-[110px_minmax(0,1fr)]"
                >
                  <span className="font-heading text-xl font-semibold text-rouge lg:text-[22px]">
                    {h.year}
                  </span>
                  <span className="text-base lg:text-[17px]">{h.title}</span>
                </li>
              ))}
            </ol>
          )}
          <Link
            className="text-[15px] font-bold text-rouge hover:text-rouge-hover"
            href="/historique"
          >
            Lire l’histoire de la paroisse
          </Link>
        </div>

        {motDuCure.message && (
          <div
            className="grid scroll-mt-4 grid-cols-1 items-start gap-6 sm:grid-cols-[200px_minmax(0,1fr)] lg:col-span-6 lg:col-start-7 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8"
            id="cure"
          >
            <EmplacementImage
              alt={
                motDuCure.signature
                  ? `Portrait : ${motDuCure.signature}`
                  : "Portrait du curé"
              }
              className="h-[280px] w-full lg:h-80"
              libelle="Portrait du curé"
              src={motDuCure.photo}
            />
            <div className="flex flex-col gap-4">
              <span className="text-sm font-bold text-rouge">
                Le mot du curé
              </span>
              <p className="m-0 line-clamp-[10] whitespace-pre-line font-scripture text-xl leading-[1.45] text-marine lg:text-2xl">
                {motDuCure.message}
              </p>
              {motDuCure.signature && (
                <span className="text-base font-semibold">
                  {motDuCure.signature}
                </span>
              )}
              <Link
                className="text-[15px] font-bold text-rouge hover:text-rouge-hover"
                href="/equipes"
              >
                Lire le message
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
