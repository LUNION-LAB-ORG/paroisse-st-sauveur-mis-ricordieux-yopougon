"use client";
import Image from "next/image";
import { useState } from "react";

const listButton = [
  {
    label: "Conseil Paroissial",
    value: "conseilParoissial",
  },
  {
    label: "Conseil pour les Affaires Économiques",
    value: "conseilAffaires",
  },
];

export default function Conseils() {
  const [table, setTable] = useState("conseilParoissial");

  const handlerTable = (value: string) => {
    setTable(value);
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-20 flex flex-col gap-10 sm:gap-12 lg:gap-16 max-w-6xl mx-auto">
      {/* Titre + description */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Conseils Paroissiaux
        </h2>
        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
          Découvrez les structures de gouvernance qui accompagnent notre paroisse dans sa mission pastorale
          et sa gestion économique. Ces conseils, composés de clercs et de laïcs, œuvrent ensemble pour le
          bien de notre communauté.
        </p>
      </div>

      {/* Boutons de filtre */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-base md:text-lg font-semibold">
        {listButton.map((item, index) => (
          <button
            key={index}
            className={`pb-1 border-b-4 transition-colors ${
              table === item.value
                ? "border-red-700 text-red-700"
                : "border-transparent text-gray-500 hover:text-red-700"
            }`}
            onClick={() => handlerTable(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Contenu du conseil sélectionné */}
      <div className="bg-red-50 border-l-8 border-red-800 p-6 sm:p-8 rounded-md flex flex-col gap-6 sm:gap-8">
        <div className="bg-blue-100 p-4 w-fit rounded-xl">
          <Image
            alt="Document"
            src="/assets/icons/Document.png"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        </div>

        <div>
          <h3 className="font-bold text-red-800 text-lg sm:text-xl mb-2">
            Le Conseil Paroissial
          </h3>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Le Conseil Paroissial est un organe consultatif qui assiste le curé dans sa mission pastorale.
            Il réfléchit aux orientations de la paroisse, propose des initiatives pour favoriser la vie
            chrétienne et évalue les activités pastorales déjà existantes. Ce conseil se réunit environ tous
            les deux mois et est composé de membres représentant les différentes réalités de notre
            communauté.
          </p>
        </div>
      </div>

      {/* Conclusion */}
      <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
        Notre équipe pastorale est composée de prêtres et de diacres engagés au service de notre
        communauté. Chacun d'eux met ses talents et son charisme particulier au service de l'annonce
        de l'Évangile et de l'accompagnement spirituel des fidèles.
      </p>
    </section>
  );
}
