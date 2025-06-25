// "use client";
// import Image from "next/image";
// import { Button } from "@heroui/button";
// import {
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownTrigger,
// } from "@heroui/dropdown";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";

// const data = [
//   {
//     id: 1,
//     title: "Père Antoine Dubois",
//     date: "2018 - Présent",
//     description: `Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse. Veille à la beauté et à la profondeur spirituelle des liturgies.`,
//     image: "/assets/images/service-2.jpg",
//     detail: `Ordonné prêtre en 2005 dans le diocèse de Lyon, le Père Antoine Dubois a rejoint notre paroisse en septembre 2018. Après avoir servi comme vicaire à la Cathédrale Saint-Jean et comme aumônier d'hôpital, il apporte à notre communauté une expérience riche et variée du ministère sacerdotal.

// Titulaire d'un doctorat en théologie de l'Université Grégorienne de Rome, il est particulièrement attaché à la formation des adultes et à l'approfondissement de la foi. Sous son impulsion, la paroisse a développé une présence numérique plus importante et une dynamique communautaire renouvelée.`,
//   },
//   { id: 2,
//     title: "Père Antoine Dubois",
//     date: "2018 - Présent",
//     description: `Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse.
//      Veille à la beauté et à la profondeur spirituelle des liturgies. `,
//     image: "/assets/images/service-2.jpg",
//     link: "",
//   },
//   {
//     id: 3,
//     title: "Père Antoine Dubois",
//     date: "2018 - Présent",
//     description: `Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse.
//      Veille à la beauté et à la profondeur spirituelle des liturgies. `,
//     image: "/assets/images/service-2.jpg",
//     link: "",
//   },
//   {
//     id: 4,
//     title: "Père Antoine Dubois",
//     date: "2018 - Présent",
//     description: `Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse.
//      Veille à la beauté et à la profondeur spirituelle des liturgies. `,
//     image: "/assets/images/service-2.jpg",
//     link: "",
//   },
// ];

// export default function Cures() {
//   return (
//     <section className="py-16 px-4 max-w-7xl mx-auto">
//       <h2 className="text-center text-blue-900 uppercase font-extrabold text-4xl md:text-5xl mb-12">
//         Nos Curés
//       </h2>
//       <p className="max-w-3xl mx-auto text-center text-muted-foreground text-lg md:text-xl mb-16">
//         Depuis sa fondation en 1972, la Paroisse Saint Sauveur Miséricordieux a été guidée par des prêtres dévoués qui ont contribué à bâtir notre communauté de foi.
//         Découvrez ceux qui ont porté la Parole de Dieu et accompagné les générations de fidèles dans notre paroisse.
//       </p>

//       <div className="grid gap-14 md:grid-cols-2">
//         {data.map((item) => (
//           <article
//             key={item.id}
//             className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden"
//           >
//             <div className="relative h-[320px] sm:h-[380px] lg:h-[420px]">
//               <Image
//                 src={item.image}
//                 alt={item.title}
//                 fill
//                 className="object-cover"
//               />
//               <div className="absolute top-6 right-0 bg-blue-900 bg-opacity-90 px-8 py-3 rounded-l-full text-white font-semibold tracking-wide shadow-lg select-none">
//                 Curé
//               </div>
//             </div>

//             <div className="p-8 flex flex-col flex-grow">
//               <h3 className="text-2xl text-blue-900 font-bold mb-1">{item.title}</h3>
//               <p className="text-red-900 mb-6 font-semibold">{item.date}</p>
//               <p className="text-gray-700 text-lg mb-8 flex-grow">{item.description}</p>

//               <Dropdown>
//                 <DropdownTrigger>
//                   <Button color="primary" className="rounded-full px-12 py-4 text-lg w-full md:w-auto">
//                     En savoir plus
//                   </Button>
//                 </DropdownTrigger>
//                 <DropdownMenu
//                   variant="faded"
//                   className="max-w-xl p-8"
//                   aria-label={`Plus d'informations sur ${item.title}`}
//                 >
//                   <DropdownItem key="details" className="cursor-default">
//                     <div className="space-y-6 text-gray-800 text-base leading-relaxed">
//                       <p>{item.detail}</p>
//                     </div>
//                   </DropdownItem>
//                 </DropdownMenu>
//               </Dropdown>
//             </div>
//           </article>
//         ))}
//       </div>
//     </section>
//   );
// }
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

const data = [
  {
    id: 1,
    title: "Père Antoine Dubois",
    date: "2018 - Présent",
    description: `Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse. Veille à la beauté et à la profondeur spirituelle des liturgies.`,
    image: "/assets/images/service-2.jpg",
    detail: `Ordonné prêtre en 2005 dans le diocèse de Lyon, le Père Antoine Dubois a rejoint notre paroisse en septembre 2018. Après avoir servi comme vicaire à la Cathédrale Saint-Jean et comme aumônier d'hôpital, il apporte à notre communauté une expérience riche et variée du ministère sacerdotal.

    Titulaire d'un doctorat en théologie de l'Université Grégorienne de Rome, il est particulièrement attaché à la formation des adultes et à l'approfondissement de la foi. Sous son impulsion, la paroisse a développé une présence numérique plus importante et une dynamique communautaire renouvelée.`,
  },
  {
    id: 2,
    title: "Père Antoine Dubois",
    date: "2018 - Présent",
    description: `Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse.
     Veille à la beauté et à la profondeur spirituelle des liturgies. `,
    image: "/assets/images/service-2.jpg",
    link: "",
  },
  {
    id: 3,
    title: "Père Antoine Dubois",
    date: "2018 - Présent",
    description: `Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse.
     Veille à la beauté et à la profondeur spirituelle des liturgies. `,
    image: "/assets/images/service-2.jpg",
    link: "",
  },
  {
    id: 4,
    title: "Père Antoine Dubois",
    date: "2018 - Présent",
    description: `Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse.
     Veille à la beauté et à la profondeur spirituelle des liturgies. `,
    image: "/assets/images/service-2.jpg",
    link: "",
  },
];

export default function Cures() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 12 },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 16 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 24 },
      },
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

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
          {data.map((item) => (
            <article
              key={item.id}
              className="keen-slider__slide bg-white rounded-lg shadow-md overflow-hidden flex flex-col border border-gray-100"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 bg-blue-800 text-white text-xs px-3 py-1 rounded-full">
                  Curé
                </div>
              </div>

              <div className="p-4 flex flex-col">
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-red-800 mb-2">{item.date}</p>
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
                    aria-label={`Plus d'informations sur ${item.title}`}
                  >
                    <DropdownItem key="details" className="cursor-default">
                      <p className="text-gray-800 text-sm whitespace-pre-line">
                        {item.detail}
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
        {data.map((_, idx) => (
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
