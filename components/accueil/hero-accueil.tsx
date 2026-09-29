import type { IIdentiteParoisse } from "@/features/setting/utils/identite";

import Link from "next/link";

import { EmplacementImage } from "./emplacement-image";

import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";

function BoutonsHero({ className }: { className?: string }) {
  return (
    <div className={cn("flex-col gap-2.5 lg:flex-row lg:gap-3", className)}>
      <Link
        className="rounded-charte bg-rouge px-[26px] py-[15px] text-center text-[15px] font-bold text-white hover:bg-rouge-hover hover:text-white lg:py-4 lg:text-base"
        href="#eglise"
      >
        Soutenir la construction
      </Link>
      <Link
        className="rounded-charte border border-white px-[26px] py-[14px] text-center text-[15px] font-bold text-white hover:bg-white/10 hover:text-white lg:py-[15px] lg:text-base"
        href="#horaires"
      >
        Horaires des messes
      </Link>
    </div>
  );
}

export function HeroAccueil({
  identite,
  vueEglise,
}: {
  identite: IIdentiteParoisse;
  vueEglise: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-marine text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        alt=""
        className="pointer-events-none absolute -left-40 -top-[120px] hidden size-[620px] rounded-full opacity-5 lg:block"
        src={identite.logo}
      />
      <div
        className={cn(
          CONTENEUR,
          "relative grid grid-cols-1 gap-4 pb-[30px] pt-7 lg:min-h-[640px] lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:py-16",
        )}
      >
        <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-[22px]">
          <span className="text-xs font-bold uppercase tracking-[.12em] text-ciel lg:text-sm">
            {identite.devise}
          </span>
          <h1 className="m-0 font-heading text-[30px] font-extrabold uppercase leading-[1.1] lg:text-[clamp(36px,3.6vw,52px)] lg:leading-[1.05] lg:tracking-[-0.01em]">
            {identite.nom}
          </h1>
          <p className="m-0 text-base leading-[1.55] text-brume-clair lg:text-[19px] lg:leading-[1.6]">
            {identite.description}
          </p>
          <BoutonsHero className="hidden lg:mt-1.5 lg:flex" />
        </div>

        <figure className="m-0 flex flex-col gap-3 lg:col-span-7 lg:col-start-6">
          <EmplacementImage
            surFondMarine
            alt="Vue d’architecte de la future église Saint Sauveur Miséricordieux"
            className="h-[208px] w-full rounded-charte lg:h-[440px] lg:shadow-[0_30px_60px_rgba(10,12,40,.35)]"
            libelle="Vue d’architecte de la future église"
            src={vueEglise}
          />
          <figcaption className="flex justify-between text-[13px] text-brume lg:text-sm">
            <span>Vue d’architecte de la future église</span>
            <Link
              className="hidden font-bold text-ciel hover:text-white lg:inline"
              href="#eglise"
            >
              Suivre le projet
            </Link>
          </figcaption>
        </figure>
        <BoutonsHero className="flex lg:hidden" />
      </div>
    </section>
  );
}
