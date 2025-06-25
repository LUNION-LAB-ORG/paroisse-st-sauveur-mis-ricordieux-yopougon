"use client";
import Link from "next/link";
import Image from "next/image";
import { CalendarClock, MapPin } from "lucide-react";
import { EvenementType } from "./body-actualites";
import { Button } from "@heroui/button";

interface Props {
  txt1: string;
  dataContainer: EvenementType[];
}

export default function CardContainer({ txt1, dataContainer }: Props) {
  return (
    <section className="px-4 max-w-7xl mx-auto">
      <h2 className="text-blue-900 text-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-16">
        {txt1}
      </h2>

      <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 ">
        {dataContainer.map((item, index) => (
          <div
            key={index}
            className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden"
          >
            {/* Image & date tag */}
            <div className="relative">
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4 bg-white rounded-lg px-4 py-2 shadow text-blue-900 font-bold text-sm uppercase">
                {item.date}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between h-full px-6 py-6">
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  {item.title}
                </h3>

                <div className="flex items-center text-gray-600 gap-6 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4" />
                    <span>{item.heure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{item.lieux}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <Link href={item.link}>
                <Button
                  color="primary"
                  className="w-full text-base py-4 font-semibold"
                >
                  Plus d'info
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
