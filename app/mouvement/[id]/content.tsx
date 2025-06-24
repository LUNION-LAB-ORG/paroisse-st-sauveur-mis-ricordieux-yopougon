import CardHeader from "@/components/mouvement/children/cardHeader";
import { Mouvement } from "./page";
import Image from "next/image";
import MouvementEquipes from "@/components/mouvement/children/mouvementEquipes";
import FormulaireContact from "@/components/mouvement/children/formulaireContact";
import LastSection from "@/components/mouvement/children/lastSection";
import NavigationSection from "@/components/mouvement/children/navigationSection";

interface Props {
  data: Mouvement;
}

const dataLinks = [
  {
    name: "Accueil",
    nav: "/",
  },
  {
    name: "Mouvement",
    nav: "/mouvement",
  },
];

export default function Content({ data }: Props) {
  // dataHeader={data.header}
  return (
    <div className="flex flex-col">
      <CardHeader />
      {/* body */}
      <div className="flex flex-col gap-12 lg:gap-20 ppb-16">
        <NavigationSection dataLinks={dataLinks} />
        <div className=" px-4 max-w-7xl mx-auto ">
          <Image
            className="object-cover w-full max-h-[700px]"
            width={2731}
            height={4096}
            alt="priere"
            src={data.header.image}
          />
          <h2 className="font-cinzel text-blue-900 text-xl md:text-2xl lg:text-3xl font-bold py-6 !leading-relaxed ">
            {data.header.title}
          </h2>
          <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
            {data.header.description}
          </p>
        </div>

        {/* nos objectifs */}
        <section className="w-full px-4 max-w-7xl mx-auto">
          <h2 className="font-cinzel text-blue-900 text-xl md:text-2xl lg:text-3xl font-bold py-6 !leading-relaxed ">
            {data.nosobjectifs.title}
          </h2>
          <ul className="pl-4 sm:pl-10">
            {data.nosobjectifs.content.map((item, index) => (
              <li key={index} className="list-disc sm:pl-2 mb-2">
                <p className="text-xl md:text-2xl  opacity-90 leading-relaxed">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* nos activites */}
        <section className="w-full px-4 max-w-7xl mx-auto">
          <h2 className="font-cinzel text-blue-900 text-xl md:text-2xl lg:text-3xl font-bold py-6 !leading-relaxed ">
            {data.nosActivités.title}
          </h2>
          <ul className="pl-4 sm:pl-10">
            {data.nosActivités.content.map((item, index) => (
              <li key={index} className="list-disc sm:pl-2 mb-2">
                <p className="text-xl md:text-2xl  opacity-90 leading-relaxed">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Calendrier */}
        <section className="w-full px-4 max-w-7xl mx-auto">
          <h2 className="font-cinzel text-blue-900 text-xl md:text-2xl lg:text-3xl font-bold py-6 !leading-relaxed ">
            {data.CalendrierEtRéunions.title}
          </h2>
          <ul className="pl-4 sm:pl-10">
            {data.CalendrierEtRéunions.content.map((item, index) => (
              <li key={index} className=" mb-2">
                <p className="text-xl md:text-2xl  opacity-90 leading-relaxed">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* equipe  */}
        <MouvementEquipes />

        {/* formulaire */}
        <FormulaireContact />

        {/* last element */}
        <LastSection />
      </div>
    </div>
  );
}
