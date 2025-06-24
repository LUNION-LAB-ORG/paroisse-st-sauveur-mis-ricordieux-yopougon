"use client";
import Image from "next/image";
import { Share2 } from "lucide-react";

const data = [
  {
    title: "Mouvement de la Paroisse",
    description: `Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse.
     Veille à la beauté et à la profondeur spirituelle des liturgies. `,
    image: "/assets/images/mvt-paroise.jpg",
    link: "",
  },
  {
    title: "Équipe Liturgique",
    description: `Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse.
     Veille à la beauté et à la profondeur spirituelle des liturgies. `,
    image: "/assets/images/mvt-paroise.jpg",
    link: "",
  },
  {
    title: "Catéchèse",
    description: `Accompagne les enfants dans leur découverte de la foi et leur préparation aux sacrements.
     Propose des rencontres régulières et des temps forts au cours de l'année. `,
    image: "/assets/images/mvt-paroise.jpg",
    link: "",
  },
  {
    title: "Secours Catholique",
    description: `Porte assistance aux personnes en difficulté à travers diverses actions de solidarité.
     Accompagnement social, aide alimentaire, vestiaire et moments de convivialité.`,
    image: "/assets/images/mvt-paroise.jpg",
    link: "",
  },
  {
    title: "Catéchèse",
    description: `Accompagne les enfants dans leur découverte de la foi et leur préparation aux sacrements.
     Propose des rencontres régulières et des temps forts au cours de l'année. `,
    image: "/assets/images/mvt-paroise.jpg",
    link: "",
  },
  {
    title: "Secours Catholique",
    description: `Porte assistance aux personnes en difficulté à travers diverses actions de solidarité.
     Accompagnement social, aide alimentaire, vestiaire et moments de convivialité.`,
    image: "/assets/images/mvt-paroise.jpg",
    link: "",
  },
];

export default function CardMeditation() {
  return (
    <section>
      <div className="px-4 max-w-7xl mx-auto">
        <h2 className="text-blue-900 text-2xl md:text-3xl lg:text-4xl text-center font-bold mb-10">
          Mouvements de la Paroisse
        </h2>
        <p className="mb-10 lg:mb-28 text-center max-w-4xl mx-auto text-xl  lg:text-2xl text-muted-foreground ">
          {` Découvrez les différents groupes et associations qui animent notre communauté paroissiale.
           Chacun de ces mouvements participe à la vie et à la mission de notre paroisse, offrant des opportunités d'engagement,
            de service et de croissance spirituelle. N'hésitez pas à contacter 
            les responsables pour plus d'informations ou pour rejoindre un mouvement.`}
        </p>

        <div className="grid  lg:grid-cols-2 gap-10 lg:gap-20">
          {data.map((item, index) => {
            return (
              <div key={index} className="flex flex-col ">
                <div className="mb-2 lg:mb-4">
                  <Image
                    className="w-full h-[300px] sm:h-[350px] lg:h-[450px] object-cover ]"
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={300}
                  />
                </div>
                <div className="">
                  <h3 className="text-xl lg:text-4xl font-bold mb-3 lg:mb-10 text-blue-900 ">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-xl lg:text-2xl mb-4 lg:mb-8 max-w-[90%]">
                    {item.description}
                  </p>

                  {/* cartfooter */}
                  <div className="max-w-[90%] flex justify-between">
                    <button className="bg-indigo-200 text-md lg:text-xl  rounded-full px-10 py-3 ">
                      {`Silence`}
                    </button>

                    <button className="bg-slate-200 px-4 rounded-lg">
                      <Share2 />
                    </button>
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
