"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

const data = [
  {
    message:
      "Faire partie de la chorale a transformé ma foi. Chanter, c'est prier deux fois, et partager ce moment avec d'autres paroissiens est une joie.",
    name: "Sophie M.",
    role: "Membre de la Chorale",
    image: "/assets/images/avatar-temoin.jpg",
  },
  {
    message:
      "Participer aux mouvements paroissiaux m’a permis de grandir spirituellement.",
    name: "Jean-Luc B.",
    role: "Animateur catéchèse",
    image: "/assets/images/avatar-temoin.jpg",
  },
  {
    message:
      "Grâce à l’équipe liturgique, j’ai redécouvert la prière communautaire.",
    name: "Claire T.",
    role: "Responsable liturgie",
    image: "/assets/images/avatar-temoin.jpg",
  },
];

export default function Temoignage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 24 },
      },
    },
  });

  // Auto-play toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <section className="py-20 bg-slate-50">
      <div className="px-4 max-w-6xl mx-auto">
        <h2 className="text-blue-900 text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-12">
          Témoignages
        </h2>

        {/* Slider */}
        <div ref={sliderRef} className="keen-slider">
          {data.map((item, index) => (
            <div
              key={index}
              className="keen-slider__slide bg-white rounded-xl shadow p-6 flex flex-col items-center text-center transition duration-300 ease-in-out"
            >
              <p className="text-lg md:text-xl text-gray-700 italic mb-6">
                “{item.message}”
              </p>
              <div className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover border border-blue-200"
                />
                <div className="text-left">
                  <p className="text-blue-900 font-bold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation boutons */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => instanceRef.current?.prev()}
            className="p-3 rounded-full border border-blue-200 hover:bg-blue-100 transition"
            aria-label="Précédent"
          >
            <ArrowLeft className="w-5 h-5 text-blue-700" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="p-3 rounded-full border border-blue-200 hover:bg-blue-100 transition"
            aria-label="Suivant"
          >
            <ArrowRight className="w-5 h-5 text-blue-700" />
          </button>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          {data.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full transition ${
                currentSlide === idx
                  ? "bg-blue-700"
                  : "bg-gray-300 hover:bg-blue-300"
              }`}
              aria-label={`Aller au témoignage ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
