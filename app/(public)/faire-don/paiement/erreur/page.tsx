import type { Metadata } from "next";

import { LIEN_DON } from "@/components/site/navigation";
import { PageRetour } from "@/components/site/page-retour";

export const metadata: Metadata = {
  title: "Paiement non abouti",
  robots: { index: false },
};

export default function PageErreurDon() {
  return (
    <PageRetour
      actions={[
        { label: "Réessayer", href: LIEN_DON },
        { label: "Retour à l’accueil", href: "/" },
      ]}
      etat="erreur"
      surtitre="Don"
      titre="Paiement non abouti"
    >
      <p className="m-0">
        Le paiement n’a pas pu être complété. Aucun montant n’a été débité.
      </p>
      <p className="m-0 text-[15px] text-gris">
        Cela peut être dû à un solde insuffisant, une annulation, ou un problème
        technique.
      </p>
    </PageRetour>
  );
}
