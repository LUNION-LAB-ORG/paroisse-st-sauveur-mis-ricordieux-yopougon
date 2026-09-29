"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { PageRetour } from "@/components/site/page-retour";
import { waveAPI } from "@/features/don/apis/wave.api";
import { formatMontant } from "@/lib/charte";

interface SuccesInscriptionProps {
  id: string;
  titreEvenement: string | null;
  lienEvenement: string;
}

function Contenu({
  id,
  titreEvenement,
  lienEvenement,
}: SuccesInscriptionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");
  const [verification, setVerification] = useState(!!ref);
  const [montant, setMontant] = useState<string | null>(null);

  useEffect(() => {
    // Sans référence (inscription gratuite déjà confirmée) : rien à vérifier
    if (!ref) return;
    waveAPI
      .checkStatus(ref)
      .then((statut) => {
        if (statut.payment_status !== "succeeded") {
          router.replace(
            `/evenement/${id}/inscription/erreur?ref=${encodeURIComponent(ref)}`,
          );

          return;
        }
        if (statut.amount) setMontant(statut.amount);
        setVerification(false);
      })
      .catch(() => setVerification(false));
  }, [ref, id, router]);

  if (verification) {
    return (
      <PageRetour
        etat="attente"
        surtitre="Inscription"
        titre="Vérification de votre inscription…"
      >
        <p className="m-0">Merci de patienter quelques secondes.</p>
      </PageRetour>
    );
  }

  return (
    <PageRetour
      actions={[
        { label: "Voir tous les événements", href: "/agenda" },
        { label: "Retour à l’accueil", href: "/" },
      ]}
      etat="succes"
      surtitre="Inscription"
      titre="Inscription confirmée !"
    >
      {titreEvenement && (
        <a
          className="font-heading text-xl font-bold text-marine hover:text-rouge"
          href={lienEvenement}
        >
          {titreEvenement}
        </a>
      )}
      {montant && (
        <p className="m-0 font-bold text-marine">
          Paiement de {formatMontant(Number(montant))} FCFA reçu
        </p>
      )}
      <p className="m-0">
        Votre inscription a été enregistrée avec succès. Nous vous contacterons
        prochainement avec les détails.
      </p>
      <p className="m-0 font-scripture text-xl italic text-marine">
        Que Dieu vous bénisse et à très bientôt !
      </p>
    </PageRetour>
  );
}

export function SuccesInscription(props: SuccesInscriptionProps) {
  return (
    <Suspense>
      <Contenu {...props} />
    </Suspense>
  );
}
