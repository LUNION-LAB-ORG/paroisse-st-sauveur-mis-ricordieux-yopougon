"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Home, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { waveAPI } from "@/features/don/apis/wave.api";

export default function SuccesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!ref) {
      setChecking(false);
      return;
    }

    waveAPI
      .checkStatus(ref)
      .then((status) => {
        if (status.payment_status !== "succeeded") {
          router.replace(`/faire-don/paiement/erreur?ref=${ref}`);
        }
      })
      .catch(() => {
        // En cas d'erreur réseau, on affiche quand même la page succès
        // car Wave a déjà redirigé ici depuis success_url
      })
      .finally(() => setChecking(false));
  }, [ref, router]);

  if (checking) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/assets/images/hero-faire-don.jpg" alt="Vérification" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4 text-white">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-lg font-medium">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/hero-faire-don.jpg" alt="Merci" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-[#2d2d83] mb-3">
            Merci pour votre don !
          </h1>
          <p className="text-gray-600 mb-2 leading-relaxed">
            Votre paiement a été effectué avec succès via Wave.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Que Dieu vous bénisse pour votre générosité envers la paroisse Saint Sauveur Miséricordieux.
          </p>

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
              <Home className="w-4 h-4" /> Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
