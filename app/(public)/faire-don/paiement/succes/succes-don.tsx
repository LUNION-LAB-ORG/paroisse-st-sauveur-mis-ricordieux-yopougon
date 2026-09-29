"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { LIEN_DON } from "@/components/site/navigation";
import { PageRetour } from "@/components/site/page-retour";
import { waveAPI } from "@/features/don/apis/wave.api";
import { formatMontant } from "@/lib/charte";

interface SuccesDonProps {
  nom: string;
  adresse: string;
  telephone: string;
}

/**
 * Retour après un don. Deux cas :
 *  - `?mode=paroisse`    → don enregistré « à régler » : instructions pour le
 *                          versement au secrétariat, sans vérification Wave ;
 *  - `?ref=<client_ref>` → retour Wave : on vérifie que le paiement est bien
 *                          « succeeded » avant de remercier, sinon → /erreur ;
 *  - ni l'un ni l'autre  → accès direct sans contexte → retour au formulaire.
 */
function Contenu({ nom, adresse, telephone }: SuccesDonProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");
  const estParoisse = searchParams.get("mode") === "paroisse";
  const [verification, setVerification] = useState(!estParoisse);
  const [montant, setMontant] = useState<string | null>(null);

  useEffect(() => {
    if (estParoisse) return;
    if (!ref) {
      router.replace(LIEN_DON);

      return;
    }
    const erreur = `/faire-don/paiement/erreur?ref=${encodeURIComponent(ref)}`;

    waveAPI
      .checkStatus(ref)
      .then((statut) => {
        if (statut.payment_status === "succeeded") {
          if (statut.amount) setMontant(statut.amount);
          setVerification(false);
        } else router.replace(erreur);
      })
      .catch(() => router.replace(erreur));
  }, [ref, estParoisse, router]);

  if (verification) {
    return (
      <PageRetour
        etat="attente"
        surtitre="Don"
        titre="Vérification du paiement…"
      >
        <p className="m-0">Merci de patienter quelques secondes.</p>
      </PageRetour>
    );
  }

  const actions = [
    { label: "Faire un autre don", href: LIEN_DON },
    { label: "Retour à l’accueil", href: "/" },
  ];

  if (estParoisse) {
    return (
      <PageRetour
        actions={actions}
        etat="succes"
        surtitre="Don"
        titre="Don enregistré !"
      >
        <p className="m-0">
          Nous avons bien pris note de votre intention de don. Merci de vous
          rendre à la paroisse pour le versement en espèces ou par chèque.
        </p>
        <p className="m-0 border-l-2 border-marine pl-4 text-[15px]">
          {nom}
          <br />
          {adresse}
          {telephone && (
            <>
              <br />
              {telephone}
            </>
          )}
        </p>
        <p className="m-0 text-sm text-gris">
          Votre don sera définitivement validé par le secrétariat une fois le
          versement reçu.
        </p>
      </PageRetour>
    );
  }

  return (
    <PageRetour
      actions={actions}
      etat="succes"
      surtitre="Don"
      titre="Merci pour votre don !"
    >
      {montant && (
        <p className="m-0 font-bold text-marine">
          {formatMontant(Number(montant))} FCFA reçus
        </p>
      )}
      <p className="m-0">Votre paiement a été effectué avec succès via Wave.</p>
      <p className="m-0 font-scripture text-xl italic text-marine">
        Que Dieu vous bénisse pour votre générosité envers la paroisse Saint
        Sauveur Miséricordieux.
      </p>
    </PageRetour>
  );
}

export function SuccesDon(props: SuccesDonProps) {
  return (
    <Suspense>
      <Contenu {...props} />
    </Suspense>
  );
}
