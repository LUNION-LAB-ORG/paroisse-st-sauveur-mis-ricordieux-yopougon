"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import { serviceAPI } from "@/features/service/apis/service.api";
import type { IService } from "@/features/service/types/service.type";

export default function Paroisse() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceAPI
      .obtenirTous()
      .then((res) => setServices(res.data ?? []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 max-w-7xl mx-auto">
      <h2 className="text-blue-900 text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3">
        Mouvements de la Paroisse
      </h2>
      <p className="text-center max-w-3xl mx-auto text-gray-600 text-lg md:text-xl mb-10">
        Découvrez les groupes dynamiques qui animent notre paroisse. Engagement,
        prière, solidarité… chaque mouvement est un chemin vers le Christ.
      </p>

      {loading && <p className="text-center text-gray-400 py-12">Chargement...</p>}

      {!loading && services.length === 0 && (
        <p className="text-center text-gray-400 py-12">
          Aucun mouvement disponible pour le moment.
        </p>
      )}

      {!loading && services.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {services.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg flex flex-col h-full"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-100 shrink-0">
                <Image
                  src={item.image || "/assets/images/mvt-paroise.jpg"}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-blue-800 text-xl font-semibold mb-2 line-clamp-2 min-h-[3.5rem]">
                  {item.title}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-1">
                  {item.description}
                </p>

                {(item.leader || item.schedule) && (
                  <div className="flex flex-col gap-1.5 mb-4 text-xs text-gray-500">
                    {item.leader && (
                      <span className="inline-flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.leader}</span>
                      </span>
                    )}
                    {item.schedule && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.schedule}</span>
                      </span>
                    )}
                  </div>
                )}

                <Link href={`/mouvement/${item.id}`} className="mt-auto">
                  <Button
                    variant="primary"
                    className="w-full rounded-full text-sm px-6 py-2 font-medium"
                  >
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
