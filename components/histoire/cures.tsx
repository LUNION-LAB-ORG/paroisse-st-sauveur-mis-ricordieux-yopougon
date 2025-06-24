"use client";
import Image from "next/image";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

const data = [
  {
    id: 1,
    title: "Père Antoine Dubois",
    date: "2018 - Présent",
    description: `Prépare et anime les célébrations eucharistiques et autres temps de prière de la paroisse.
     Veille à la beauté et à la profondeur spirituelle des liturgies. `,
    image: "/assets/images/service-2.jpg",
    link: "",
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
  return (
    <section>
      <div>
        <h2 className="text-blue-900 text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-10">
          Nos Curés
        </h2>
        <p className="mb-10 lg:mb-28 text-center max-w-4xl mx-auto text-xl  lg:text-2xl text-muted-foreground ">
          {` Depuis sa fondation en 1972, la Paroisse Saint Sauveur Miséricordieux a été guidée par des prêtres dévoués qui ont contribué à bâtir notre communauté de foi.
           Découvrez ceux qui ont porté la Parole de Dieu et accompagné les générations de fidèles dans notre paroisse.`}
        </p>

        <div className="grid  lg:grid-cols-2 gap-10 lg:gap-20">
          {data.map((item, index) => {
            return (
              <div key={index} className="flex flex-col ">
                <div className="relative mb-4 lg:mb-12">
                  <Image
                    alt={item.title}
                    className="w-full h-[300px] object-cover sm:h-[350px] lg:h-[450px] "
                    height={300}
                    src={item.image}
                    width={500}
                  />
                  <div className="absolute top-10 right-0 p-5 text-white rounded-l-[50px]  bg-blue-900">
                    Curé
                  </div>
                </div>
                <div>
                  <h3 className="text-xl lg:text-4xl font-bold mb-2 text-blue-900 ">
                    {item.title}
                  </h3>
                  <h4 className="mb-4 lg:mb-10 text-red-900">{item.date}</h4>
                  <p className="text-gray-600 text-xl lg:text-2xl mb-4 lg:mb-8 max-w-[90%]">
                    {item.description}
                  </p>
                  <Button
                    className="rounded-full text-md lg:text-xl py-4 lg:px-28 lg:py-8"
                    color="primary"
                  >
                    En savoir plus{" "}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";

function HistoireDropdown() {
  return (
    <Dropdown className="overflow-hidden" backdrop="blur">
      <DropdownTrigger>
        <Button
          className="rounded-full text-md lg:text-xl py-4 lg:px-28 lg:py-8"
          color="primary"
        >
          En savoir plus{" "}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Static Actions"
        className="!max-w-7xl overflow-y-scroll  p-14 !hover:shadow-none !hover:border-none"
        variant="faded"
      >
        <DropdownItem
          className="!hover:shadow-none !hover:border-none"
          key="new"
        >
          <div className="text-lg flex flex-col gap-8 lg:gap-16">
            {/* header */}
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <Image
                alt="Mr le cure"
                className="h-[300px] object-cover"
                height={130}
                src="/assets/images/service-2.jpg"
                width={339}
              />
              <div>
                <h2 className="font-bold text-2xl text-blue-900 mb-2 lg:mb-4">{`Père Antoine Dubois`}</h2>
                <h3 className="text-xl text-red-900 mb-2 lg:mb-4">{`Curé de 2018 à aujourd'hui`}</h3>
                <p>
                  {`  Ordonné prêtre en 2005 dans le diocèse de Lyon, le Père Antoine
              Dubois a rejoint notre paroisse en septembre 2018. Après avoir
              servi comme vicaire à la Cathédrale Saint-Jean et comme aumônier
              d'hôpital, il apporte à notre communauté une expérience riche et
              variée du ministère sacerdotal.`}
                </p>
              </div>
            </div>

            {/* body */}
            <div>
              <p>
                {`Titulaire d'un doctorat en théologie de l'Université Grégorienne de Rome, le Père Antoine est particulièrement attaché à la formation des adultes et à l'approfondissement de la foi. Il a mis en place des parcours de formation biblique et théologique accessibles à tous les paroissiens.
Sous son impulsion, notre paroisse a développé une présence numérique plus importante, permettant de toucher davantage de fidèles, notamment pendant la période difficile de la pandémie. Le Père Antoine porte également une attention particulière à l'accueil des familles et à la catéchèse des enfants.
Connu pour sa disponibilité et son écoute, le Père Antoine a su créer une dynamique communautaire renouvelée, encourageant les initiatives des laïcs et favorisant la participation de tous à la vie paroissiale.`}
              </p>
            </div>

            {/* footer */}
            <div className="p-10 border-l-8 border-red-900 bg-red-50">
              {`
              "L'Église n'est pas un musée de saints, mais un hôpital de campagne pour les pécheurs. Notre mission est d'accueillir chacun là où il en est et de cheminer ensemble vers le Christ."
              `}
            </div>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
