"use client";

import Link from "next/link";

/** Boutons de la confirmation : agenda (.ics), reçu imprimable, nouvelle demande. */
export function ActionsConfirmation({
  lienIcs,
  lienRecu,
}: {
  lienIcs: string;
  lienRecu: string;
}) {
  return (
    <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <a
        className="rounded-charte bg-marine px-[22px] py-[15px] text-center text-[15px] font-bold text-white hover:bg-marine-deep hover:text-white hover:no-underline"
        href={lienIcs}
      >
        Ajouter à mon agenda
      </a>
      <Link
        className="rounded-charte border border-marine px-[22px] py-3.5 text-center text-[15px] font-bold text-marine hover:text-marine hover:no-underline"
        href={lienRecu}
        target="_blank"
      >
        Télécharger le reçu
      </Link>
      <Link
        className="min-h-11 px-1.5 py-3.5 text-center text-[15px] font-bold text-rouge underline underline-offset-4"
        href="/demande-messe"
      >
        Faire une autre demande
      </Link>
    </div>
  );
}
