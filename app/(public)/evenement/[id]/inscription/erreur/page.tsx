import type { Metadata } from "next";

import { PageRetour } from "@/components/site/page-retour";

export const metadata: Metadata = {
  title: "Inscription non aboutie",
  robots: { index: false },
};

type Props = { params: Promise<{ id: string }> };

/** Retour Wave en cas d'échec du paiement d'une inscription. */
export default async function PageErreurInscription({ params }: Props) {
  const { id } = await params;

  return (
    <PageRetour
      actions={[
        { label: "Réessayer l’inscription", href: `/agenda/${id}` },
        { label: "Voir tous les événements", href: "/agenda" },
      ]}
      etat="erreur"
      surtitre="Inscription"
      titre="Inscription non aboutie"
    >
      <p className="m-0">
        Le paiement n’a pas pu être complété. Votre inscription n’a pas été
        enregistrée.
      </p>
      <p className="m-0 text-[15px] text-gris">
        Cela peut être dû à un solde insuffisant, une annulation, ou un problème
        technique. Vous pouvez réessayer.
      </p>
    </PageRetour>
  );
}
