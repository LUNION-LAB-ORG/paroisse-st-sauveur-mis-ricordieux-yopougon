"use client";

import { CalendarClock, MapPin } from "lucide-react";

const data = [
  {
    programme: "Répétition Chorale",
    heure: "20h00",
    salle: "Salle paroissiale",
    jour: "12",
    mois: "MAI",
  },
  {
    programme: "Veillée de prière",
    heure: "19h00",
    salle: "Chapelle Sainte Marie",
    jour: "15",
    mois: "MAI",
  },
  {
    programme: "Préparation au baptême",
    heure: "18h30",
    salle: "Salle Jean-Paul II",
    jour: "18",
    mois: "MAI",
  },
  {
    programme: "Rencontre des jeunes",
    heure: "16h00",
    salle: "Centre paroissial",
    jour: "20",
    mois: "MAI",
  },
];

export default function Agenda() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="px-4 max-w-7xl mx-auto">
        <h2 className="text-blue-900 text-center text-3xl md:text-4xl font-bold mb-12">
          Agenda des prochaines activités
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="relative flex items-start bg-white border-l-4 border-blue-800 shadow-md p-6 rounded-xl"
            >
              {/* Date bloc */}
              <div className="flex-shrink-0 text-center bg-red-800 text-white rounded-md px-5 py-3 mr-6">
                <p className="text-3xl font-extrabold leading-none">
                  {item.jour}
                </p>
                <p className="text-sm uppercase tracking-wider">{item.mois}</p>
              </div>

              {/* Infos */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  {item.programme}
                </h3>
                <p className="text-gray-700 flex items-center gap-2 mb-1">
                  <CalendarClock className="w-5 h-5 text-blue-800" />
                  {item.heure}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-800" />
                  {item.salle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
