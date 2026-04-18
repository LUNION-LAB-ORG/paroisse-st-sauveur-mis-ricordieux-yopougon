"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarHeart, Clock, MapPin } from "lucide-react";
import { programmationAPI } from "@/features/programmation/apis/programmation.api";
import {
  IProgrammation,
  PROGRAMMATION_CATEGORIES,
} from "@/features/programmation/types/programmation.type";

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

const FALLBACK = "/assets/images/evenement.jpg";

export default function ProgrammationsPublicPage() {
  const [items, setItems] = useState<IProgrammation[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    programmationAPI
      .obtenirTous()
      .then((res) => setItems((res.data ?? []) as IProgrammation[]))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((p) => category === "all" || p.category === category);
  }, [items, category]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2d2d83] to-[#2d2d83]/70 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <CalendarHeart className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Programmations liturgiques
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Découvrez les temps forts de notre vie paroissiale : fêtes liturgiques, retraites,
            triduums, neuvaines et célébrations à venir.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filtres */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === "all"
                  ? "bg-[#2d2d83] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#2d2d83]/40"
              }`}
            >
              Toutes
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === c
                    ? "bg-[#2d2d83] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#2d2d83]/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="text-center text-gray-400 py-12">Chargement...</p>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <CalendarHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune programmation à venir pour le moment.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <Link
                key={p.id}
                href={`/programmations/${p.id}`}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="relative w-full aspect-[16/10] bg-gray-100">
                  <Image
                    src={p.image || FALLBACK}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
                  {p.category && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#2d2d83] text-xs font-semibold px-3 py-1 rounded-full">
                      {p.category}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-blue-900 text-xl font-semibold mb-2 line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{p.description}</p>

                  <div className="flex flex-col gap-1.5 text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarHeart className="w-3.5 h-3.5" />
                      {formatFR(p.date_at)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(p.started_at)}
                      {p.ended_at && ` – ${formatTime(p.ended_at)}`}
                    </span>
                    {p.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {p.location}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
