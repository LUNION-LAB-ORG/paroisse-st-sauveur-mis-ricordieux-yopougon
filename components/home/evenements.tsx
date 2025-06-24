import Link from "next/link";
import { link } from "node:fs";
// import { Button } from "../ui/button";
import Image from "next/image";
import { CalendarClock, MapPinHouse } from "lucide-react";
import { Button } from "@heroui/button";

const data = [
  {
    title: "Grande Messe du 3ème dimanche de Pâques",
    description:
      "Célébration présidée par Monseigneur l'Archevêque dans le cadre de sa visite pastorale.",
    heure: "09h00",
    lieux: "Église",
    image: "/assets/images/evenement.jpg",
    link: "",
  },
  {
    title: "Grande Messe du 3ème dimanche de Pâques",
    description:
      "Célébration présidée par Monseigneur l'Archevêque dans le cadre de sa visite pastorale.",
    heure: "09h00",
    lieux: "Église",
    image: "/assets/images/evenement.jpg",
    link: "",
  },
  {
    title: "Grande Messe du 3ème dimanche de Pâques",
    description:
      "Célébration présidée par Monseigneur l'Archevêque dans le cadre de sa visite pastorale.",
    heure: "09h00",
    lieux: "Église",
    image: "/assets/images/evenement.jpg",
    link: "",
  },
];

export default function Evenements() {
  return (
    <section className=" px-4  max-w-7xl mx-auto ">
      <h2 className="text-blue-900 text-2xl md:text-3xl lg:text-4xl font-bold mb-10">
        Prochains Événements
      </h2>

      <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
        {data.map((item, index) => {
          return (
            <div key={index} className="flex flex-col ">
              <div className="pb-2">
                <Image
                  className="w-full h-auto object-cover ]"
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={300}
                />
              </div>
              <div className="">
                <h3 className="text-xl font-semibold mb-4 text-blue-800 ">
                  {item.title}
                </h3>
                <div className="pb-2 flex gap-10">
                  {/* heure */}
                  <div className="flex items-center gap-4">
                    <CalendarClock className="w-5 h-5" />
                    <span>{item.heure}</span>
                  </div>
                  {/* lieux */}
                  <div className="flex items-center gap-2">
                    <MapPinHouse className="w-5 h-5" />
                    <span>{item.lieux}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 max-w-[90%]">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className="text-blue-500 hover:underline"
                >
                  <Button
                    color="primary"
                    className="text-md lg:text-xl lg:w-full py-4 lg:py-8"
                  >
                    {`Plus d'info`}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
