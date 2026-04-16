"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
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
      <p className="text-center max-w-3xl mx-auto text-gray-600 text-lg md:text-xl mb-6">
        Découvrez les groupes dynamiques qui animent notre paroisse. Engagement,
        prière, solidarité… chaque mouvement est un chemin vers le Christ.
      </p>

      {loading && (
        <p className="text-center text-gray-400 py-12">Chargement...</p>
      )}

      {!loading && services.length === 0 && (
        <p className="text-center text-gray-400 py-12">Aucun mouvement disponible pour le moment.</p>
      )}

      {!loading && services.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 justify-center">
          {services.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <Image
                src={item.image || "/assets/images/mvt-paroise.jpg"}
                alt={item.title}
                width={600}
                height={400}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-blue-800 text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
                <Link href={`/mouvement/${item.id}`}>
                  <Button
                    variant="primary"
                    className="rounded-full text-sm px-6 py-2 font-medium"
                  >
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
