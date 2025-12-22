"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { CalendarClock, CalendarDays, MapPinHouse } from "lucide-react";
import Image from "next/image";
import { Event } from "@/services/Events/types/events.type";

export default function Evenements({ event }: { event: Event[] }) {
  const dataEvent = event;

  // PAGINATION
  const ITEMS_PER_PAGE = 6; // tu peux changer 6 par 9, 12, etc.
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dataEvent.length / ITEMS_PER_PAGE);

  const paginatedEvents = dataEvent.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="px-4 max-w-7xl mx-auto">
      <h2 className="text-blue-900 text-2xl md:text-3xl lg:text-4xl font-bold mb-10">
        Prochains Événements
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedEvents.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden p-6 flex flex-col"
          >
            <div className="w-full h-[200px] relative">
              <Image
                src={`${item.image}`}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-md font-semibold mb-4 text-blue-800 mt-5 text-center">
              {item.title}
            </h3>

            <div className="pb-2 flex gap-4 justify-center">
              <div className="flex items-center gap-1 text-[10px] text-gray-700">
                <CalendarDays className="w-5 h-5" />
                <span>{item.date_at ?? "Date à venir"}</span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-gray-700">
                <CalendarClock className="w-5 h-5" />
                <span>{item.time_at ?? "—"}</span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-gray-700">
                <MapPinHouse className="w-5 h-5" />
                <span>{item.location_at ?? "À préciser"}</span>
              </div>
            </div>

            <p className="text-gray-900 py-2 mb-4 text-center text-sm mx-auto">
              {item.description}
            </p>

            <Link href={`/actualites/${item.id}`} className="w-full">
              <Button color="primary" className="text-md w-full py-2">
                Plus d&apos;infos
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* PAGINATION BUTTONS */}
      <div className="flex justify-center mt-10 gap-3">
        <Button
          isDisabled={currentPage === 1}
          onPress={() => setCurrentPage((p) => p - 1)}
        >
          Précédent
        </Button>

        <span className="px-4 py-2 text-blue-900 font-semibold">
          Page {currentPage} / {totalPages}
        </span>

        <Button
          isDisabled={currentPage === totalPages}
          onPress={() => setCurrentPage((p) => p + 1)}
        >
          Suivant
        </Button>
      </div>
    </section>
  );
}
