"use client";

import { CalendarDays, ChevronDown } from "lucide-react";

const data = [
  {
    heure: "06:00 - 07:30",
    messe: "Messe du matin",
  },
  {
    heure: "08:00 - 09:00",
    messe: "Confession",
  },
  {
    heure: "10:00 - 11:30",
    messe: "Messe chantée",
  },
  {
    heure: "18:00 - 19:30",
    messe: "Adoration et louange",
  },
];

export default function SelectProgramme() {
  return (
    <section className="relative bg-white w-full px-4 sm:px-6 lg:px-10 py-16 max-w-7xl mx-auto">
      {/* Calendrier */}
      <div className="mx-auto bg-blue-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 max-w-xl shadow-lg">
        <CalendarDays className="w-12 h-12 sm:w-16 sm:h-16" />
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl mb-1 font-medium">Sélectionner une date</h3>
          <h4 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">22 avril 2025</h4>
        </div>
        <div className="bg-white/10 hover:bg-white/20 transition-colors rounded-full p-3 cursor-pointer ml-auto">
          <ChevronDown className="w-6 h-6" />
        </div>
      </div>

      {/* Titre jour liturgique */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-blue-900 text-center mt-14 mb-10">
        Mardi dans l'octave de Pâques
      </h2>

      {/* Programmes */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 justify-center">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-blue-50 border-t-8 border-blue-800 rounded-xl p-6 shadow hover:shadow-md transition"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mb-4">
              {item.heure}
            </h3>
            <div className="h-[1px] bg-blue-900 w-full mb-4" />
            <p className="text-base sm:text-lg text-gray-800 font-medium">
              {item.messe}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
