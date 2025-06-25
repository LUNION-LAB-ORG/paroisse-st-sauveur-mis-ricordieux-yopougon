"use client";

import { Button } from "@heroui/button";
import { Clock2, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const data = [
  {
    title: "Père Jean Dupont",
    role: "Responsable de la paroisse",
    description: `Ordonné prêtre en 2005, le Père Jean sert notre paroisse depuis 2018. Passionné par la liturgie et l'accompagnement spirituel, il est également aumônier du groupe de prière des jeunes adultes.`,
    image: "/assets/images/equipe-card.jpg",
    email: "pere.jean@paroissesaintsauveur.fr",
    date: "Permanence : Mardi et Jeudi, 16h-18h",
    phone: "01 23 45 67 89",
  },
  {
    title: "Sœur Marie Claire",
    role: "Responsable de la catéchèse",
    description: `Avec douceur et pédagogie, Sœur Marie Claire accompagne les enfants et les familles dans la découverte de la foi chrétienne.`,
    image: "/assets/images/equipe-card.jpg",
    email: "marie.claire@paroissesaintsauveur.fr",
    date: "Permanence : Mercredi, 10h-12h",
    phone: "01 98 76 54 32",
  },
];

// const btnsFilter = [
//   { id: 1, title: "Tous", value: "all" },
//   { id: 2, title: "Prêtres", value: "pretres" },
//   { id: 3, title: "Diacres", value: "diacres" },
//   { id: 4, title: "Administration", value: "administration" },
// ];

export default function TabsProgrammes() {
  const router = useRouter();

  const handleFilterClick = (value: string) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("filter", value);
    router.push(currentUrl.toString(), { scroll: false });
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Filtres */}
        {/* <div className="overflow-x-auto mb-12">
          <div className="flex gap-4 w-fit mx-auto">
            {btnsFilter.map((btn) => (
              <Button
                key={btn.id}
                onClick={() => handleFilterClick(btn.value)}
                className="text-md md:text-lg font-semibold border-2 border-blue-900 rounded-full px-6 py-3 hover:bg-blue-900 hover:text-white transition-colors"
              >
                {btn.title}
              </Button>
            ))}
          </div>
        </div> */}

        {/* Cartes */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full h-64">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-1 uppercase">
                  {item.title}
                </h3>
                <h4 className="text-gray-700 text-sm font-extrabold mb-4">{item.role}</h4>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 text-gray-800 text-md">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-blue-900" />
                    <span className="truncate text-sm text-gray-400">{item.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock2 className="w-4 h-4 text-blue-900" />
                    <span className="text-sm text-gray-400">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-900" />
                    <span className="text-sm text-gray-400">{item.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
