"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Home, Loader2, Church } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { waveAPI } from "@/features/don/apis/wave.api";

function SuccesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");

  const [checking, setChecking] = useState(true);
  const [amount, setAmount] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        if (!ref) {
          setChecking(false);
          return;
        }
        const status = await waveAPI.checkStatus(ref);
        if (status.payment_status !== "succeeded") {
          router.replace(`/demande-messe/erreur?ref=${ref}`);
          return;
        }
        if (status.amount) setAmount(status.amount);
      } catch {
        // Si la vérification échoue, on reste sur cette page
      } finally {
        setChecking(false);
      }
    };
    run();
  }, [ref, router]);

  if (checking) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/assets/images/hero-histoire.jpg" alt="Vérification" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4 text-white">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-lg font-medium">Vérification de votre paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/hero-histoire.jpg" alt="Demande confirmée" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-[#2d2d83] mb-3">
            Demande confirmée !
          </h1>

          {amount && (
            <p className="text-sm text-green-700 font-semibold mb-3">
              Paiement de {Number(amount).toLocaleString("fr-FR")} XOF reçu ✅
            </p>
          )}

          <p className="text-gray-600 mb-2 leading-relaxed text-sm">
            Votre demande de messe a bien été enregistrée. Un membre de notre équipe
            paroissiale vous contactera sous 48&nbsp;heures.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Que Dieu vous bénisse.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/demande-messe"
              className="flex items-center justify-center gap-2 w-full bg-[#98141f] hover:bg-[#7a1019] text-white py-3 rounded-xl font-medium transition-colors"
            >
              <Church className="w-4 h-4" /> Nouvelle demande
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

export default function Page() {
  return (
    <Suspense>
      <SuccesContent />
    </Suspense>
  );
}
