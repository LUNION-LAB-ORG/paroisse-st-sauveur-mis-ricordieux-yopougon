import CardHeader from "@/components/mouvement/children/cardHeader";
import Image from "next/image";
import MouvementEquipes from "@/components/mouvement/children/mouvementEquipes";
import FormulaireContact from "@/components/mouvement/children/formulaireContact";
import LastSection from "@/components/mouvement/children/lastSection";
import NavigationSection from "@/components/mouvement/children/navigationSection";
import type { IService } from "@/features/service/types/service.type";

interface Props {
  data: IService;
}

const dataLinks = [
  { name: "Accueil", nav: "/" },
  { name: "Mouvement", nav: "/mouvement" },
];

export default function Content({ data }: Props) {
  return (
    <div className="flex flex-col">
      <CardHeader />
      <div className="flex flex-col gap-12 lg:gap-20 pb-16">
        <NavigationSection dataLinks={dataLinks} />

        <div className="px-4 max-w-7xl mx-auto w-full">
          {data.image && (
            <Image
              className="object-cover w-full max-h-[700px] rounded-xl mb-8"
              width={1200}
              height={600}
              alt={data.title}
              src={data.image}
            />
          )}
          <h2 className="font-cinzel text-blue-900 text-xl md:text-2xl lg:text-3xl font-bold py-6 !leading-relaxed">
            {data.title}
          </h2>
          <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
            {data.description}
          </p>
        </div>

        <MouvementEquipes />
        <FormulaireContact />
        <LastSection />
      </div>
    </div>
  );
}
