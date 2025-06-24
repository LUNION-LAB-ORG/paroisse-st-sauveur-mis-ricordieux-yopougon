import Link from "next/link";
import { link } from "node:fs";
import Image from "next/image";
import { Button } from "@heroui/button";

const data = [
  {
    title: "Demander une Messe",
    description:
      "Faites une demande de messe d'intention ou d'action de grâce.",
    image: "/assets/images/service-1.jpg",
    btn: "Demander",
    link: "",
  },
  {
    title: "Demander une Écoute",
    description: "Prenez rendez-vous pour un temps d'écoute ou de confession.",
    image: "/assets/images/service-2.jpg",
    btn: "Contacter",
    link: "",
  },
  {
    title: "Organiser un Événement",
    description: "Planifiez une activité ou un événement paroissial.",
    image: "/assets/images/service-3.jpg",
    btn: "Organiser",
    link: "",
  },
];

export default function Services() {
  return (
    <section className="relative w-full px-4 max-w-7xl mx-auto py-8 ">
      <h2 className="text-blue-900 text-2xl md:text-3xl lg:text-4xl font-bold mb-10">
        Services rapide
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="flex flex-col text-center px-2 py-4 lg:px-6 bg-slate-50"
            >
              <div className="pb-2">
                <Image
                  alt={item.title}
                  className="w-full object-cover h-[200px] lg:h-[150px] "
                  height={300}
                  src={item.image}
                  width={500}
                />
              </div>
              <div className="">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-blue-800 ">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Link
                  href={item.link}
                  className="text-blue-500 hover:underline"
                >
                  <Button
                    color="primary"
                    className="text-md lg:text-xl lg:w-full py-4 lg:py-8"
                  >
                    {item.btn}
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
