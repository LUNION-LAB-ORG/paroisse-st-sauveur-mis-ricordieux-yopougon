import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";

const data = [
  {
    title: "Mouvement de la Paroisse",
    description: `Anime les célébrations eucharistiques et les temps de prière avec ferveur.`,
    image: "/assets/images/mvt-paroise.jpg",
    link: "/mouvement/1",
  },
  {
    title: "Équipe Liturgique",
    description: `Assure la beauté spirituelle des liturgies et accompagne la prière de la communauté.`,
    image: "/assets/images/mvt-paroise.jpg",
    link: "/mouvement/2",
  },
  {
    title: "Catéchèse",
    description: `Accompagne les enfants dans la foi et la préparation aux sacrements.`,
    image: "/assets/images/mvt-paroise.jpg",
    link: "/mouvement/3",
  },
  {
    title: "Secours Catholique",
    description: `Offre un soutien concret aux plus démunis à travers la solidarité chrétienne.`,
    image: "/assets/images/mvt-paroise.jpg",
    link: "/mouvement/4",
  },
];

export default function Paroisse() {
  return (
    <section className="px-4 max-w-7xl mx-auto">
      <h2 className="text-blue-900 text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3">
        Mouvements de la Paroisse
      </h2>
      <p className="text-center max-w-3xl mx-auto text-gray-600 text-lg md:text-xl mb-6">
        Découvrez les groupes dynamiques qui animent notre paroisse. Engagement,
        prière, solidarité… chaque mouvement est un chemin vers le Christ.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 justify-center">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={600}
              height={400}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-blue-800 text-xl font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {item.description}
              </p>
              <Link href={item.link}>
                <Button
                  color="primary"
                  className="rounded-full text-sm px-6 py-2 font-medium"
                >
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
