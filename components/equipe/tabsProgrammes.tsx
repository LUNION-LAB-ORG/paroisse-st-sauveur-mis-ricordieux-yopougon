"use client";

import { useState, useEffect } from "react";
import { Card } from "@heroui/react";
import { Calendar, User } from "lucide-react";
import Image from "next/image";
import { cureAPI } from "@/features/cure/apis/cure.api";
import type { ICure } from "@/features/cure/types/cure.type";

const FILTERS = [
  { id: 1, title: "Tous", value: "all" },
  { id: 2, title: "En poste", value: "current" },
  { id: 3, title: "Anciens", value: "former" },
];

function formatPeriod(started_at: string, ended_at: string | null) {
  const start = started_at ? new Date(started_at).getFullYear() : "?";
  if (!ended_at) return `Depuis ${start}`;
  const end = new Date(ended_at).getFullYear();
  return `${start} – ${end}`;
}

export default function TabsProgrammes() {
  const [pastors, setPastors] = useState<ICure[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    cureAPI
      .obtenirTous()
      .then((res) => setPastors(res.data ?? []))
      .catch(() => setPastors([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = pastors.filter((p) => {
    if (filter === "current") return !p.ended_at;
    if (filter === "former") return !!p.ended_at;
    return true;
  });

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-[#2d2d83] text-2xl sm:text-3xl font-bold mb-4">
          Notre Équipe Pastorale
        </h2>
        <p className="text-center text-gray-500 text-sm max-w-2xl mx-auto mb-10">
          Découvrez les prêtres et les membres qui ont animé et animent encore notre paroisse.
        </p>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap justify-center mb-10">
          {FILTERS.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.value)}
              className={`text-sm font-semibold border-2 rounded-full px-6 py-2 transition-colors ${
                filter === btn.value
                  ? "bg-[#2d2d83] border-[#2d2d83] text-white"
                  : "border-[#2d2d83] text-[#2d2d83] hover:bg-[#2d2d83] hover:text-white"
              }`}
            >
              {btn.title}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-center text-gray-400 py-12">Chargement...</p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">Aucun membre disponible.</p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative w-full h-64">
                  <Image
                    src={item.photo || "/assets/images/equipe-card.jpg"}
                    alt={item.fullname}
                    fill
                    className="object-cover"
                  />
                  {!item.ended_at && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      En poste
                    </div>
                  )}
                </div>

                <Card.Content className="p-6">
                  <Card.Title className="text-lg font-bold text-[#2d2d83] mb-1 uppercase">
                    {item.fullname}
                  </Card.Title>
                  <p className="text-[#98141f] text-sm font-semibold mb-4">Curé de la paroisse</p>

                  {item.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 text-[#2d2d83]" />
                    <span>{formatPeriod(item.started_at, item.ended_at)}</span>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
