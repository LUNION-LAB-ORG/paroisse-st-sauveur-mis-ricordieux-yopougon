"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { CheckCircle, Home, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { waveAPI } from "@/features/don/apis/wave.api";
import { evenementAPI } from "@/features/evenement/apis/evenement.api";
import type { IEvenement } from "@/features/evenement/types/evenement.type";

function SuccesContent() {
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const ref = searchParams.get("ref");
  const eventId = params.id;

  const [checking, setChecking] = useState(true);
  const [event, setEvent] = useState<IEvenement | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const [status, ev] = await Promise.allSettled([
          ref ? waveAPI.checkStatus(ref) : Promise.resolve(null),
          evenementAPI.obtenirParId(eventId),
        ]);

        if (ev.status === "fulfilled") setEvent(ev.value);

        if (status.status === "fulfilled" && status.value) {
          const s = status.value;
          if (s.payment_status !== "succeeded") {
            router.replace(`/evenement/${eventId}/inscription/erreur?ref=${ref ?? ""}`);
            return;
          }
          if (s.amount) setAmount(s.amount);
        }
      } catch {
        // Si pas de ref (inscription gratuite déjà confirmée), on reste sur cette page
      } finally {
        setChecking(false);
      }
    };

    checkPayment();
  }, [ref, eventId, router]);

  if (checking) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/evenement.jpg"
            alt="Vérification"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4 text-white">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-lg font-medium">Vérification de votre inscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/evenement.jpg"
          alt="Inscription confirmée"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/80 via-[#2d2d83]/60 to-[#98141f]/40" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-[#2d2d83] mb-3">
            Inscription confirmée !
          </h1>

          {event && (
            <p className="text-gray-700 font-medium mb-2">
              {event.title}
            </p>
          )}

          {amount && (
            <p className="text-sm text-green-700 font-semibold mb-2">
              Paiement de {Number(amount).toLocaleString("fr-FR")} XOF reçu ✅
            </p>
          )}

          <p className="text-gray-600 mb-2 leading-relaxed text-sm">
            Votre inscription a été enregistrée avec succès.
            Nous vous contacterons prochainement avec les détails.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Que Dieu vous bénisse et à très bientôt !
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/evenement"
              className="flex items-center justify-center gap-2 w-full bg-[#98141f] hover:bg-[#7a1019] text-white py-3 rounded-xl font-medium transition-colors"
            >
              <Calendar className="w-4 h-4" /> Voir tous les événements
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

export default function InscriptionSuccesPage() {
  return (
    <Suspense>
      <SuccesContent />
    </Suspense>
  );
}
