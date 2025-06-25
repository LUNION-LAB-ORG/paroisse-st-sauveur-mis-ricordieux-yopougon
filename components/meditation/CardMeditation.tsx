"use client";

import Image from "next/image";
import { Share2 } from "lucide-react";

const data = [
  {
    title: "Mouvement de la Paroisse",
    description:
      "Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse. Veille à la beauté et à la profondeur spirituelle des liturgies.",
    image: "/assets/images/mvt-paroise.jpg",
  },
  {
    title: "Équipe Liturgique",
    description:
      "Anime les célébrations avec ferveur et prépare les temps de prière. Assure la qualité spirituelle des liturgies.",
    image: "/assets/images/mvt-paroise.jpg",
  },
  {
    title: "Catéchèse",
    description:
      "Accompagne les enfants dans leur foi et leur préparation aux sacrements avec des rencontres régulières.",
    image: "/assets/images/mvt-paroise.jpg",
  },
  {
    title: "Secours Catholique",
    description:
      "Assiste les personnes en difficulté à travers des actions concrètes : aide alimentaire, vestiaire, accompagnement.",
    image: "/assets/images/mvt-paroise.jpg",
  },
];

export default function CardMeditation() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="px-4 max-w-7xl mx-auto">
        <h2 className="text-blue-900 text-center text-3xl lg:text-5xl font-bold mb-10">
          Mouvements de la Paroisse
        </h2>
        <p className="mb-16 text-center max-w-3xl mx-auto text-lg lg:text-xl text-muted-foreground">
          Découvrez les différents groupes et associations qui animent notre communauté paroissiale. Chacun participe à la mission de l'Église en offrant un engagement spirituel, humain ou caritatif.
        </p>

        <div className="grid md:grid-cols-2 gap-6 px-20">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-64">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <button className="bg-indigo-100 text-indigo-800 font-medium rounded-full px-6 py-2 text-sm">
                    Silence
                  </button>
                  <button className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
