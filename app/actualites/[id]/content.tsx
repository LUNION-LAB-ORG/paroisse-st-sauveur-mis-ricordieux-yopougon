// import CardHeader from "@/components/mouvement/children/cardHeader";
import Image from "next/image";
import { CalendarDays, Clock3, FileText, MapPinHouse } from "lucide-react";
import { Button } from "@heroui/button";

// import { ActualitésId } from "./page";

import CardHeader from "@/components/actualites/children/cardHeader";
import NavigationSection from "@/components/mouvement/children/navigationSection";

type ActualitésId = {
  id: string;
  header: {
    image: string;
    title: string;
    description: string;
  };
  nosobjectifs: {
    title: string;
    content: string[];
  };
  nosActivités: {
    title: string;
    content: string[];
  };
  CalendrierEtRéunions: {
    title: string;
    content: string[];
  };
};
interface Props {
  data: ActualitésId;
}

const dataLinks = [
  {
    name: "Accueil",
    nav: "/",
  },
  {
    name: "Actualites",
    nav: "/actualites",
  },
];

export default function Content({ data }: Props) {
  // dataHeader={data.header}
  return (
    <div>
      <CardHeader />
      {/* body */}
      <div className="flex flex-col gap-14 text-stone-600 text-xl md:text-2xl ">
        <NavigationSection dataLinks={dataLinks} />
        <div className=" px-4 max-w-7xl mx-auto ">
          <Image
            alt="priere"
            className="object-cover w-full max-h-[450px]"
            height={4096}
            src="/assets/images/mvt-id.jpg"
            width={2731}
          />
          <p className="bg-slate-200 text-blue-900 text-semibold rounded-full my-5 w-fit p-4 px-10">
            Événement
          </p>
          {/* title description */}
          <h2 className="font-cinzel text-blue-900 text-lg md:text-xl lg:text-2xl font-bold mb-6 !leading-relaxed ">{`Inscription au pèlerinage paroissial à Notre-Dame de Lourdes`}</h2>
          {/* info lieu , heur , salle  */}
          <div className="flex flex-col md:flex-row gap-4 lg:gap-10 mb-14  text-lg lg:text-xl  ">
            {/* date */}
            <div className="flex items-center gap-4">
              <CalendarDays />
              <span className="  opacity-90 leading-relaxed">{`15 Avril 2025`}</span>
            </div>
            {/* heure */}
            <div className="flex items-center gap-4">
              <Clock3 />
              <span className="  opacity-90 leading-relaxed">09:30</span>
            </div>
            {/* lieux */}
            <div className="flex items-center gap-4">
              <MapPinHouse />
              <span className="  opacity-90 leading-relaxed">
                Salle paroissiale Saint Joseph
              </span>
            </div>
            {/* auteur */}
            <p className="  opacity-90 leading-relaxed">
              Par Père François Martin
            </p>
          </div>
          {/* description */}
          <p>{`
            Les inscriptions pour le pèlerinage à Notre-Dame de Lourdes sont désormais ouvertes à tous les paroissiens.
             Ce temps fort de notre année paroissiale nous permettra de nous rassembler autour de Marie et de vivre ensemble des moments de prière, de partage et de fraternité.
            Informations pratiques Le pèlerinage aura lieu du 12 au 16 juin 2025.
             Le départ se fera en car depuis le parvis de l'église à 6h00 le matin du 12 juin.
            `}</p>
        </div>
        {/* programme */}
        <section className="w-full px-4 max-w-7xl mx-auto">
          <h2 className="mb-8">{data.nosobjectifs.title}</h2>
          <ul className=" pl-4 sm:pl-10">
            {data.nosobjectifs.content.map((item, index) => (
              <li key={index} className="list-disc sm:pl-2 mb-2">
                <p className="text-xl md:text-2xl  opacity-90 leading-relaxed">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Modalités d'inscription */}
        <section className="w-full px-4 max-w-7xl mx-auto">
          <h2 className="mb-8">{`Modalités d'inscription`}</h2>
          <p>{`Pour vous inscrire, plusieurs options s'offrent à vous : `} </p>

          <ol className="pl-4 sm:pl-8">
            <li>
              <p>
                {` Remplir le formulaire disponible à l'accueil de la paroisse`}
              </p>
            </li>
            <li>
              <p>
                {` Télécharger le formulaire ci-dessous et le déposer au secrétariat`}
              </p>
            </li>
            <li>
              <p>{`S'inscrire en ligne via le formulaire sur cette page`}</p>
            </li>
          </ol>

          <p>{`
          Le coût du pèlerinage est de 395€ par personne, comprenant le transport,
          l'hébergement en pension complète et les frais d'organisation. Des facilités de paiement sont possibles,
          n'hésitez pas à nous contacter pour en discuter."Le pèlerinage est une opportunité unique de vivre sa foi en communauté
          et de confier nos intentions à Notre-Dame. J'encourage vivement tous les paroissiens qui le peuvent à y participer."
          - Père FrançoisPréparation spirituelle En préparation au pèlerinage, nous proposons trois rencontres de préparation 
          spirituelle qui auront lieu les mercredis 14 mai, 28 mai et 4 juin à 20h à la salle paroissiale. Tous les inscrits sont invités
           à y participer.Places limitées à 50 participants, ne tardez pas à vous inscrire ! Date limite d'inscription : 15 mai 2025
          `}</p>
        </section>

        {/* DOcuments a telecharger */}
        <section className="w-full px-4 max-w-7xl mx-auto mb-14">
          <h2 className="font-cinzel text-blue-950 text-2xl md:text-3xl lg:text-4xl font-bold py-6 !leading-relaxed ">
            Documents à télécharger
          </h2>
          <div className="flex flex-col gap-10 lg:gap-16">
            {/* Document-1 */}
            <div className="flex space-y-4 sm:space-y-0 flex-wrap justify-between">
              <div className="flex gap-4">
                {/* img */}
                <div className="p-5 flex items-center justify-center flex-shrink-0 bg-blue-100 rounded-xl">
                  <FileText className="w-8 h-8" />
                </div>
                {/* text */}
                <div>
                  <p className="text-stone-800 font-bold mb-4">{`Formulaire d'inscription`}</p>
                  <p className="text-md text-stone-300-">PDF - 284 Ko</p>
                </div>
              </div>
              {/* button */}
              <Button color="primary" size="lg">Télécharger</Button>
            </div>
            {/* Document-2 */}
            <div className="flex space-y-4 sm:space-y-0 flex-wrap justify-between">
              <div className="flex gap-4">
                {/* img */}
                <div className="p-5 flex items-center justify-center flex-shrink-0 bg-blue-100 rounded-xl">
                  <FileText className="w-8 h-8" />
                </div>
                {/* text */}
                <div>
                  <p className="text-stone-800 font-bold mb-4">{`Formulaire d'inscription`}</p>
                  <p className="text-md text-stone-300-">PDF - 284 Ko</p>
                </div>
              </div>
              {/* button */}
              <Button color="primary" size="lg">Télécharger</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
