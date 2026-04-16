"use client";

import { useParams } from "next/navigation";
import { XCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function InscriptionErreurPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/evenement.jpg"
          alt="Erreur"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle size={40} className="text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-[#2d2d83] mb-3">
            Inscription non aboutie
          </h1>
          <p className="text-gray-600 mb-2 leading-relaxed">
            Le paiement n&apos;a pas pu être complété. Votre inscription n&apos;a pas été enregistrée.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Cela peut être dû à un solde insuffisant, une annulation, ou un problème technique. Vous pouvez réessayer.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href={`/evenement/${id}`}
              className="flex items-center justify-center gap-2 w-full bg-[#98141f] hover:bg-[#7a1019] text-white py-3 rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Réessayer l&apos;inscription
            </Link>
            <Link
              href="/evenement"
              className="flex items-center justify-center gap-2 text-[#2d2d83] hover:underline text-sm font-medium"
            >
              <Home className="w-4 h-4" /> Voir tous les événements
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
