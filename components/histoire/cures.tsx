"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "keen-slider/keen-slider.min.css";
import { Pastor } from "@/services/cure/types/cure.type";

export default function Cures({ cure }: { cure: Pastor[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 12 },
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 2, spacing: 16 } },
      "(min-width: 1024px)": { slides: { perView: 3, spacing: 24 } },
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  if (!cure || cure.length === 0) {
    return (
      <section className="py-14 px-4 max-w-7xl mx-auto text-center text-gray-500">
        <h2 className="text-blue-900 text-3xl font-bold mb-4">Nos Curés</h2>
        <p>Aucun curé disponible pour le moment.</p>
      </section>
    );
  }
  console.log('les données des curés sont',cure)
  return (
    <section className="py-14 px-4 max-w-7xl mx-auto relative">
      <h2 className="text-center text-blue-900 uppercase font-bold text-3xl mb-8">
        Nos Curés
      </h2>
      <p className="text-center text-gray-500 text-base max-w-2xl mx-auto mb-10">
        Depuis 1972, la paroisse a été guidée par des prêtres dévoués. Découvrez
        leur mission et leur engagement.
      </p>

      <div className="relative">
        {/* Flèches */}
        <button
          onClick={() => slider?.current?.prev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border shadow p-1 rounded-full z-10"
        >
          <ChevronLeft className="w-5 h-5 text-blue-800" />
        </button>
        <button
          onClick={() => slider?.current?.next()}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border shadow p-1 rounded-full z-10"
        >
          <ChevronRight className="w-5 h-5 text-blue-800" />
        </button>

        {/* Slider */}
        <div ref={sliderRef} className="keen-slider">
          {cure.map((item) => (
            <article
              key={item.id}
              className="keen-slider__slide bg-white rounded-lg shadow-md overflow-hidden flex flex-col border border-gray-100"
            >
              <div className="relative h-48">
                <Image
                  src={item.image || "/assets/images/cure.jpg"} // ✅ Image par défaut corrigée
                  alt={item.fullname}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 bg-blue-800 text-white text-xs px-3 py-1 rounded-full">
                  Curé
                </div>
              </div>

              <div className="p-4 flex flex-col">
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  {item.fullname}
                </h3>
                <p className="text-sm text-red-800 mb-2">
                  {item.started_at} {item.ended_at ? `- ${item.ended_at}` : ""}
                </p>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      color="primary"
                      className="rounded-full text-sm px-4 py-2 w-max self-start"
                    >
                      En savoir plus
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    variant="faded"
                    className="max-w-md p-4"
                    aria-label={`Plus d'informations sur ${item.fullname}`}
                  >
                    <DropdownItem key="details" className="cursor-default">
                      <p className="text-gray-800 text-sm whitespace-pre-line">
                        {/* Tu peux afficher d'autres détails si besoin */}
                        {`Mandat : ${item.started_at} ${
                          item.ended_at ? `- ${item.ended_at}` : "(Actuel)"
                        }`}
                      </p>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {cure.map((_, idx) => (
          <button
            key={idx}
            onClick={() => slider?.current?.moveToIdx(idx)}
            className={`w-2 h-2 rounded-full transition-colors duration-300 focus:outline-none ${
              currentSlide === idx
                ? "bg-blue-900 scale-110"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Aller à la slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
