"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { PageRetour } from "@/components/site/page-retour";
import { waveAPI } from "@/features/don/apis/wave.api";
import { formatMontant } from "@/lib/charte";

function Contenu() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");
  const [verification, setVerification] = useState(true);
  const [montant, setMontant] = useState<string | null>(null);

  useEffect(() => {
    if (!ref) {
      setVerification(false);

      return;
    }
    waveAPI
      .checkStatus(ref)
      .then((statut) => {
        if (statut.payment_status !== "succeeded") {
          router.replace(
            `/demande-messe/erreur?ref=${encodeURIComponent(ref)}`,
          );

          return;
        }
        if (statut.amount) setMontant(statut.amount);
        setVerification(false);
      })
      // Si la vérification échoue, on reste sur cette page
      .catch(() => setVerification(false));
  }, [ref, router]);

  if (verification) {
    return (
      <PageRetour
        etat="attente"
        surtitre="Demande de messe"
        titre="Vérification de votre paiement…"
      >
        <p className="m-0">Merci de patienter quelques secondes.</p>
      </PageRetour>
    );
  }

  return (
    <PageRetour
      actions={[
        { label: "Nouvelle demande", href: "/demande-messe" },
        { label: "Retour à l’accueil", href: "/" },
      ]}
      etat="succes"
      surtitre="Demande de messe"
      titre="Demande confirmée !"
    >
      {montant && (
        <p className="m-0 font-bold text-marine">
          Paiement de {formatMontant(Number(montant))} FCFA reçu
        </p>
      )}
      <p className="m-0">
        Votre demande de messe a bien été enregistrée. Un membre de notre équipe
        paroissiale vous contactera sous 48 heures.
      </p>
      <p className="m-0 font-scripture text-xl italic text-marine">
        Que Dieu vous bénisse.
      </p>
    </PageRetour>
  );
}

export function SuccesDemande() {
  return (
    <Suspense>
      <Contenu />
    </Suspense>
  );
}
