"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarHeart, Clock, MapPin } from "lucide-react";
import { programmationAPI } from "@/features/programmation/apis/programmation.api";
import type { IProgrammation } from "@/features/programmation/types/programmation.type";

function formatFR(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatTime(iso?: string | null): string {
  if (!iso) return "";
  if (/^\d{2}:\d{2}/.test(iso)) return iso.slice(0, 5);
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function ProgrammationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<IProgrammation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    programmationAPI
      .obtenirUn(id)
      .then((res) => setItem(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Chargement...</div>;
  if (notFound || !item)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Programmation introuvable.</p>
        <Link href="/programmations" className="text-[#2d2d83] underline text-sm">
          Retour
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden">
        {item.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83]/85 to-[#2d2d83]/65" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d83] to-[#2d2d83]/70" />
        )}

        <div className="relative py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            {item.category && (
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {item.category}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
              {item.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <CalendarHeart className="w-4 h-4" /> {formatFR(item.date_at)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {formatTime(item.started_at)}
                {item.ended_at && ` – ${formatTime(item.ended_at)}`}
              </span>
              {item.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {item.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {item.description}
          </div>
        </div>
      </div>
    </div>
  );
}
