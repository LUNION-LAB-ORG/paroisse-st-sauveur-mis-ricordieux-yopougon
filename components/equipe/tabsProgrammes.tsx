"use client";
import { Button } from "@heroui/button";
import { Clock2, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const data = [
  {
    title: "Père Jean Dupont",
    role: "Responsable de la paroisse",
    description: `Ordonné prêtre en 2005, le Père Jean sert notre paroisse depuis 2018. 
    Passionné par la liturgie et l'accompagnement spirituel, 
    il est également aumônier du groupe de prière des jeunes adultes. `,
    image: "/assets/images/equipe-card.jpg",
    email: "pere. jean@parois sesaintsauveur .fr",
    date: "Permanence: Mardi et Jeudi, 16h-18h",
    phone: "01 23 45 67 89",
  },
  {
    title: "Père Jean Dupont",
    role: "Responsable de la paroisse",
    description: `Ordonné prêtre en 2005, le Père Jean sert notre paroisse depuis 2018. 
    Passionné par la liturgie et l'accompagnement spirituel, 
    il est également aumônier du groupe de prière des jeunes adultes. `,
    image: "/assets/images/equipe-card.jpg",
    email: "pere.jean@parois sesaintsauveur.fr",
    date: "Permanence: Mardi et Jeudi, 16h-18h",
    phone: "01 23 45 67 89",
  },
];

const btnsFilter = [
  {
    id: 1,
    title: "Tous",
    value: "all",
  },
  {
    id: 2,
    title: "Prêtres",
    value: "pretres",
  },
  {
    id: 3,
    title: "Diacres",
    value: "diacres",
  },
  {
    id: 4,
    title: "Administration",
    value: "administration",
  },
];

export default function TabsProgrammes() {
  const router = useRouter(); // Initialisation du router de Next.js

  // Fonction pour gérer le changement de filtre et la mise à jour de l'URL
  const handleFilterClick = (value: string) => {
    // Utilisation de l'URL avec query string pour construire l'URL avec le paramètre de filtre
    const currentUrl = new URL(window.location.href);

    currentUrl.searchParams.set("filter", value); // Ajouter ou mettre à jour le paramètre "filter"

    router.push(currentUrl.toString(), { scroll: false }); // Empêche le défilement vers le haut
  };

  return (
    <section>
      <div className="relative px-2 sm:px-4 max-w-7xl mx-auto">
        {/* filter */}
        <div className="overflow-x-scroll w-screen -mx-2 sm:-mx-4 md:w-full md:mx-0">
          <div className=" flex gap-4 mb-8 lg:mb-14 w-fit mx-auto">
            {btnsFilter.map((btn) => (
              <Button
                key={btn.id}
                className="text-xl lg:text-2xl border-4 border-red-900 rounded-full px-6 py-4 lg:px-16 lg:py-8 bg-opacity-0 text-red-900 hover:text-white hover:opacity-100 hover:bg-red-900"
                onClick={() => handleFilterClick(btn.value)} // Ajoute le paramètre filter dans l'URL
              >
                {btn.title}
              </Button>
            ))}
          </div>
        </div>

        {/* content */}
        <div className="grid  lg:grid-cols-2 gap-10 lg:gap-10">
          {data.map((item, index) => {
            return (
              <div key={index} className="flex flex-col ">
                <div className=" mb-8 lg:mb-12">
                  <Image
                    alt={item.title}
                    className="w-full h-[300px] sm:h-[350px] lg:h-[450px] object-cover ]"
                    height={300}
                    src={item.image}
                    width={500}
                  />
                </div>
                <div>
                  <h3 className="mb-2 text-xl lg:text-4xl font-bold text-blue-900 ">
                    {item.title}
                  </h3>
                  <h4 className="mb-6">{item.role}</h4>

                  <p className="text-xl lg:text-2xl mb-4 lg:mb-8">
                    {item.description}
                  </p>
                  {/* info */}
                  <div className="flex flex-col gap-4">
                    {/* Mail */}
                    <div className="flex flex-wrap items-center gap-4">
                      <Mail className="w-8 h-8" />
                      <span>{item.email}</span>
                    </div>
                    {/* date */}
                    <div className="flex flex-wrap items-center gap-4">
                      <Clock2 className="w-8 h-8" />
                      <span>{item.date}</span>
                    </div>
                    {/* phone */}
                    <div className="flex flex-wrap items-center gap-4">
                      <Phone className="w-8 h-8" />
                      <span className="text-wrap">{item.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
