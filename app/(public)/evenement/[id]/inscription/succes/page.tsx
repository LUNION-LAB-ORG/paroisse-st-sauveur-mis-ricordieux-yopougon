import type { Metadata } from "next";

import { SuccesInscription } from "./succes-inscription";

import { agendaServerAPI } from "@/features/evenement/apis/agenda.server";

export const metadata: Metadata = {
  title: "Inscription confirmée",
  robots: { index: false },
};

type Props = { params: Promise<{ id: string }> };

/** Retour Wave après une inscription payante (adresse appelée par le backend). */
export default async function PageSuccesInscription({ params }: Props) {
  const { id } = await params;
  const evenement = await agendaServerAPI.obtenir(id);

  return (
    <SuccesInscription
      id={id}
      lienEvenement={`/agenda/${evenement?.slug ?? id}`}
      titreEvenement={evenement?.title ?? null}
    />
  );
}
