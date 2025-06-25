"use client";

import { useState } from "react";

export default function Timeline() {
  const steps = [
    {
      year: "1984",
      title: "Fondation de la paroisse",
      description:
        "La paroisse est officiellement créée pour répondre aux besoins spirituels d'une population en pleine croissance. C'était un moment marquant pour toute la communauté chrétienne locale, réunie pour bâtir ensemble un nouveau foyer de foi.",
    },
    {
      year: "1990",
      title: "Chapelle construite",
      description:
        "Une première chapelle est bâtie, devenant un lieu central de prière, de rassemblement et d'évangélisation dans le quartier. Les fidèles ont participé activement à sa construction.",
    },
    {
      year: "2024",
      title: "Rénovation du clocher",
      description:
        "Des travaux de restauration sont menés pour préserver le patrimoine architectural de l'église. Le clocher a retrouvé toute sa splendeur, symbole de foi et de persévérance.",
    },
  ];

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="relative max-w-6xl mx-auto px-4 py-16">
      {/* Ligne verticale */}
      <div className="absolute left-1/2 top-0 h-full w-1 bg-gray-200 -translate-x-1/2 z-0" />

      <ul className="space-y-16 relative z-10">
        {steps.map((step, index) => {
          const isLeft = index % 2 === 0;
          const isExpanded = expanded === index;

          return (
            <li
              key={index}
              className={`relative flex flex-col md:flex-row ${
                isLeft ? "md:items-end" : "md:items-start"
              }`}
            >
           
              <div
                className={`flex flex-col items-center mb-4 md:mb-0 
                  md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10
                `}
                style={{ minWidth: "4rem" }} 
              >
                <div className="w-4 h-4 rounded-full bg-primary border-4 border-white shadow" />
                <span className="text-sm font-bold text-primary mt-1">
                  {step.year}
                </span>
              </div>

              {/* Texte */}
              <div
                className={`md:w-1/2 ${
                  isLeft ? "md:pr-6" : "md:pl-6 md:ml-auto"
                }`}
              >
                <div className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    {step.title}
                  </h3>

                  <p
                    className={`text-blue-900 text-base transition-all duration-300 ${
                      isExpanded
                        ? ""
                        : "line-clamp-2 overflow-hidden text-ellipsis"
                    }`}
                  >
                    {step.description}
                  </p>

                  <button
                    className="mt-2 text-sm text-blue-600 hover:underline"
                    onClick={() => setExpanded(isExpanded ? null : index)}
                  >
                    {isExpanded ? "Réduire" : "Lire plus"}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
