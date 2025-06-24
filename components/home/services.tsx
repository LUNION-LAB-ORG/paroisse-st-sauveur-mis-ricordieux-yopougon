import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";

const data = [
  {
    title: "Demander une Messe",
    description:
      "Faites une demande de messe d'intention ou d'action de grâce.",
    image: "/assets/images/service-1.jpg",
    btn: "Demander",
    link: "/demande-messe",
  },
  {
    title: "Demander une Écoute",
    description: "Prenez rendez-vous pour un temps d'écoute ou de confession.",
    image: "/assets/images/service-2.jpg",
    btn: "Contacter",
    link: "/ecoute",
  },
  {
    title: "Organiser un Événement",
    description: "Planifiez une activité ou un événement paroissial.",
    image: "/assets/images/service-3.jpg",
    btn: "Organiser",
    link: "/evenement",
  },
];

export default function Services() {
  return (
    <section className="relative w-full px-4 max-w-7xl mx-auto py-16">
      <h2 className="text-blue-900 text-3xl sm:text-4xl font-extrabold text-center mb-14">
        Services rapides
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden flex flex-col"
          >
            <div className="w-full h-[200px] relative">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-blue-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <Link href={item.link}>
                <Button
                  color="primary"
                  size="lg"
                  className="w-full text-md md:text-lg py-4"
                >
                  {item.btn}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
