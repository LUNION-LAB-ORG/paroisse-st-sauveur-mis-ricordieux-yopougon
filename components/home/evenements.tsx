import Link from "next/link";
import { link } from "node:fs";
// import { Button } from "../ui/button";
import Image from "next/image";
import { CalendarClock, MapPinHouse, CalendarDays} from "lucide-react";
import { Button } from "@heroui/button";
import { date } from "zod";

const data = [
  {
    title: "Grande Messe du 3ème dimanche de Pâques",
    description:
      "Célébration présidée par Monseigneur l'Archevêque dans le cadre de sa visite pastorale.",
    date: "Dimanche 15 Mai 2023",
    heure: "09h00",
    lieux: "Église",
    image: "/assets/images/evenement.jpg",
    link: "",
  },
  {
    title: "Grande Messe du 3ème dimanche de Pâques",
    description:
      "Célébration présidée par Monseigneur l'Archevêque dans le cadre de sa visite pastorale.",
    date: "Dimanche 28 Mai 2023",
    heure: "09h00",
    lieux: "Église",
    image: "/assets/images/evenement.jpg",
    link: "",
  },
  {
    title: "Grande Messe du 3ème dimanche de Pâques",
    description:
      "Célébration présidée par Monseigneur l'Archevêque dans le cadre de sa visite pastorale.",
    date: "Dimanche 21 Mai 2023",
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item, index) => {
          return (
            <div key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden p-6 flex flex-col">
              <div className=" w-full h-[200px] relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="">
                <h3 className="text-md font-semibold mb-4 text-blue-800 mt-5 justify-center items-center text-center">
                  {item.title}
                </h3>
                <div className="pb-2 flex gap-4 justify-center">
                  <div className="flex items-center gap-1 text-[10px] text-gray-700">
                    <CalendarDays className="w-5 h-5" />
                    <span>{item.date}</span>
                  </div>
                  {/* heure */}
                  <div className="flex items-center gap-1 text-[10px] text-gray-700">
                    <CalendarClock className="w-5 h-5" />
                    <span>{item.heure}</span>
                  </div>
                  {/* lieux */}
                  <div className="flex items-center gap-1 text-[10px] text-gray-700">
                    <MapPinHouse className="w-5 h-5" />
                    <span>{item.lieux}</span>
                  </div>
                </div>
                <p className="text-gray-900 py-2 mb-4 max-w-[90%] text-center text-sm">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className="text-blue-500 hover:underline"
                >
                  <Button
                    color="primary"
                    className="text-md  lg:w-full py-2 lg:py-2"
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
