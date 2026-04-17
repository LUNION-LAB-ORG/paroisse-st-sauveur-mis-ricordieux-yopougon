"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  Info,
} from "lucide-react";
import type { IEvenement } from "@/features/evenement/types/evenement.type";
import { evenementAPI } from "@/features/evenement/apis/evenement.api";

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return "";
  try {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }
    return timeStr.slice(0, 5);
  } catch {
    return timeStr;
  }
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<IEvenement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    evenementAPI
      .obtenirParId(id)
      .then(setEvent)
      .catch(() => setError("Événement introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#98141f] mx-auto mb-4" />
          <p className="text-gray-600">Chargement…</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-2xl font-bold text-[#2d2d83]">Événement introuvable</h1>
        <p className="text-gray-600">{error ?? "Cet événement n'existe pas ou n'est plus disponible."}</p>
        <Link href="/evenement" className="bg-[#98141f] hover:bg-[#7a1019] text-white px-6 py-2.5 rounded-xl font-medium">
          Voir tous les événements
        </Link>
      </div>
    );
  }

  const deadlinePassed = event.registration_deadline
    ? new Date(event.registration_deadline) < new Date()
    : false;
  const full = event.max_participants !== null
    && event.max_participants !== undefined
    && event.spots_remaining !== null
    && event.spots_remaining !== undefined
    && event.spots_remaining <= 0;
  const registrationOpen = !deadlinePassed && !full;

  const tiers = Array.isArray(event.pricing_tiers) ? event.pricing_tiers : [];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero image */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full bg-gradient-to-br from-[#2d2d83] to-[#98141f]">
        {event.image && (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Retour */}
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} /> Retour
          </button>
        </div>

        {/* Titre en overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10 max-w-5xl mx-auto">
          {event.is_paid ? (
            <span className="inline-block bg-[#98141f] text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Événement payant
            </span>
          ) : (
            <span className="inline-block bg-green-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Gratuit
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#2d2d83] mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" /> À propos
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {event.description ?? "Aucune description disponible."}
            </p>
          </div>

          {tiers.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#2d2d83] mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5" /> Tarifs disponibles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tiers.map((t, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50/30"
                  >
                    <p className="text-sm font-semibold text-[#2d2d83]">{t.label}</p>
                    <p className="text-2xl font-bold text-[#98141f] mt-1">
                      {Number(t.amount).toLocaleString("fr-FR")} XOF
                    </p>
                    {t.description && (
                      <p className="text-xs text-gray-500 mt-2">{t.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <Calendar className="w-5 h-5 text-[#2d2d83] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Date</p>
                <p className="text-gray-800 font-medium capitalize">{formatDate(event.date_at)}</p>
              </div>
            </div>

            {event.time_at && (
              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-5 h-5 text-[#2d2d83] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Heure</p>
                  <p className="text-gray-800 font-medium">{formatTime(event.time_at)}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-[#2d2d83] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Lieu</p>
                <p className="text-gray-800 font-medium">{event.location_at ?? "À préciser"}</p>
              </div>
            </div>

            {event.max_participants !== null && event.max_participants !== undefined && (
              <div className="flex items-start gap-3 text-sm">
                <Users className="w-5 h-5 text-[#2d2d83] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Places</p>
                  <p className="text-gray-800 font-medium">
                    {event.spots_remaining !== null && event.spots_remaining !== undefined
                      ? `${event.spots_remaining} place${event.spots_remaining > 1 ? "s" : ""} restante${event.spots_remaining > 1 ? "s" : ""}`
                      : `${event.max_participants} places maximum`}
                  </p>
                </div>
              </div>
            )}

            {event.registration_deadline && (
              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-5 h-5 text-[#98141f] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Clôture inscriptions
                  </p>
                  <p className="text-gray-800 font-medium">
                    {formatDate(event.registration_deadline)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {registrationOpen ? (
            <Link
              href={`/evenement/${event.id}/inscription`}
              className="flex items-center justify-center w-full bg-[#98141f] hover:bg-[#7a1019] text-white rounded-xl py-3 font-semibold transition-colors"
            >
              S'inscrire à l'événement
            </Link>
          ) : (
            <div className="w-full text-center bg-gray-100 text-gray-500 rounded-xl py-3 font-medium">
              {full ? "Événement complet" : "Inscriptions fermées"}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
