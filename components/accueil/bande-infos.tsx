import type { ILiturgie } from "@/features/liturgie/types/liturgie.type";

import Link from "next/link";

import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";
import {
  lecturesDuJour,
  titreLecture,
} from "@/features/liturgie/utils/liturgie.utils";

interface BandeInfosProps {
  liturgie: ILiturgie | null;
  prochaineCelebration: string | null;
  jourCourt: string;
}

const CELLULE = "flex flex-col gap-2 py-8 lg:border-r lg:border-ligne lg:px-8";

export function BandeInfos({
  liturgie,
  prochaineCelebration,
  jourCourt,
}: BandeInfosProps) {
  const { evangile } = lecturesDuJour(liturgie);
  const nuance = [liturgie?.degree, liturgie?.color]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="border-b border-ligne bg-white">
      {/* Mobile : une seule carte « Aujourd'hui » */}
      <div className={cn(CONTENEUR, "flex flex-col gap-1.5 py-5 lg:hidden")}>
        <span className="text-xs font-bold text-rouge">
          Aujourd’hui · {jourCourt}
        </span>
        <span className="font-heading text-base font-bold text-marine">
          {liturgie?.feast ?? "—"}
        </span>
        <span className="text-sm text-gris">
          {[
            nuance,
            prochaineCelebration && `Prochaine messe ${prochaineCelebration}`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </div>

      <div className={cn(CONTENEUR, "hidden grid-cols-4 lg:grid")}>
        <div className={cn(CELLULE, "lg:pl-0")}>
          <span className="text-[13px] font-bold text-rouge">Aujourd’hui</span>
          <span className="font-heading text-[21px] font-semibold leading-[1.25] text-marine">
            {liturgie?.feast ?? "—"}
          </span>
          {nuance && <span className="text-sm text-gris">{nuance}</span>}
        </div>
        <div className={CELLULE}>
          <span className="text-[13px] font-bold text-rouge">
            Évangile du jour{evangile?.ref && ` · ${evangile.ref}`}
          </span>
          <span className="font-scripture text-xl leading-[1.3] text-marine">
            {evangile
              ? titreLecture(evangile.title)
              : "Textes du jour indisponibles"}
          </span>
          <Link
            className="text-sm font-bold text-rouge hover:text-rouge-hover"
            href="/parole-du-jour"
          >
            Lire les textes du jour
          </Link>
        </div>
        <div className={CELLULE}>
          <span className="text-[13px] font-bold text-rouge">
            Prochaine célébration
          </span>
          <span className="font-heading text-[21px] font-semibold text-marine">
            {prochaineCelebration ?? "Voir les horaires"}
          </span>
          <Link
            className="text-sm font-bold text-rouge hover:text-rouge-hover"
            href="/horaires"
          >
            Tous les horaires
          </Link>
        </div>
        <div className="flex flex-col gap-2 py-8 pl-8">
          <span className="text-[13px] font-bold text-rouge">
            Services paroissiaux
          </span>
          <Link
            className="text-base text-encre hover:text-rouge"
            href="/demande-messe"
          >
            Demander une messe
          </Link>
          <Link
            className="text-base text-encre hover:text-rouge"
            href="/equipe#rdv"
          >
            Écoute et confession
          </Link>
          <Link
            className="text-base text-encre hover:text-rouge"
            href="/equipe#rdv"
          >
            Baptême, mariage, sacrements
          </Link>
        </div>
      </div>
    </div>
  );
}
