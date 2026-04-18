"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Home, Heart, Loader2, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { waveAPI } from "@/features/don/apis/wave.api";

/**
 * Page affichée après un don. Deux cas :
 *  - `?mode=paroisse`      → don enregistré en base en "pending", aucune
 *                            vérification Wave nécessaire. On affiche les
 *                            instructions pour régler sur place.
 *  - `?ref=<client_ref>`   → callback Wave : on vérifie que le paiement est
 *                            réellement "succeeded" avant d'afficher le
 *                            remerciement. Sinon → redirect /erreur.
 *  - ni l'un ni l'autre    → accès direct sans contexte → redirect /faire-don.
 */
function SuccesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");
  const mode = searchParams.get("mode");
  const isParoisse = mode === "paroisse";

  const [checking, setChecking] = useState(!isParoisse);
  const [amount, setAmount] = useState<string | null>(null);

  useEffect(() => {
    // Cas paroisse : pas de vérification, affichage direct
    if (isParoisse) return;

    // Pas de ref : on ne peut pas valider → rediriger vers l'accueil du don
    if (!ref) {
      router.replace("/faire-don");
      return;
    }

    waveAPI
      .checkStatus(ref)
      .then((status) => {
        if (status.payment_status === "succeeded") {
          if (status.amount) setAmount(status.amount);
          setChecking(false);
        } else {
          // Paiement pas encore confirmé (processing, cancelled…) : erreur
          router.replace(`/faire-don/paiement/erreur?ref=${ref}`);
        }
      })
      .catch(() => {
        // Impossible de vérifier le statut → on considère ça comme échec
        router.replace(`/faire-don/paiement/erreur?ref=${ref}`);
      });
  }, [ref, isParoisse, router]);

  if (checking) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/assets/images/hero-faire-don.jpg" alt="Vérification" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4 text-white">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-lg font-medium">Vérification du paiement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-10">
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/hero-faire-don.jpg" alt="Merci" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>

          {isParoisse ? (
            <>
              <h1 className="text-2xl font-bold text-[#2d2d83] mb-3">
                Don enregistré !
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nous avons bien pris note de votre intention de don. Merci de vous rendre à la
                paroisse pour le versement en espèces ou par chèque.
              </p>

              <div className="rounded-xl bg-gray-50 p-4 text-left text-sm space-y-2 mb-6">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#98141f] mt-0.5 shrink-0" />
                  <span className="text-gray-700">
                    Paroisse Saint Sauveur Miséricordieux,<br />
                    Yopougon Millionnaire, Abidjan
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#98141f] shrink-0" />
                  <span className="text-gray-700">+225 07 00 00 00 00</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-6">
                Votre don sera définitivement validé par le secrétariat une fois le versement reçu.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#2d2d83] mb-3">
                Merci pour votre don !
              </h1>
              {amount && (
                <p className="text-green-700 font-semibold mb-2">
                  {Number(amount).toLocaleString("fr-FR")} XOF reçus
                </p>
              )}
              <p className="text-gray-600 mb-2 leading-relaxed">
                Votre paiement a été effectué avec succès via Wave.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Que Dieu vous bénisse pour votre générosité envers la paroisse Saint Sauveur
                Miséricordieux.
              </p>
            </>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href="/faire-don"
              className="flex items-center justify-center gap-2 w-full bg-[#98141f] hover:bg-[#7a1019] text-white py-3 rounded-xl font-medium transition-colors"
            >
              <Heart className="w-4 h-4" /> Faire un autre don
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-[#2d2d83] hover:underline text-sm font-medium"
            >
              <Home className="w-4 h-4" /> Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccesPage() {
  return (
    <Suspense>
      <SuccesContent />
    </Suspense>
  );
}
