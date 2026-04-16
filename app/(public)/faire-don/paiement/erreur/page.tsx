import { XCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ErreurPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/hero-faire-don.jpg" alt="Erreur" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle size={40} className="text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-[#2d2d83] mb-3">
            Paiement non abouti
          </h1>
          <p className="text-gray-600 mb-2 leading-relaxed">
            Le paiement n&apos;a pas pu être complété. Aucun montant n&apos;a été débité.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Cela peut être dû à un solde insuffisant, une annulation, ou un problème technique.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/faire-don"
              className="flex items-center justify-center gap-2 w-full bg-[#98141f] hover:bg-[#7a1019] text-white py-3 rounded-xl font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Réessayer
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
