import CardHeader from "@/components/mouvement/children/cardHeader";
import Image from "next/image";
import FormulaireContact from "@/components/mouvement/children/formulaireContact";
import LastSection from "@/components/mouvement/children/lastSection";
import NavigationSection from "@/components/mouvement/children/navigationSection";
import { Clock, User } from "lucide-react";
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
      <CardHeader title={data.title} subtitle={data.description} />
      <div className="flex flex-col gap-10 lg:gap-16 pb-16">
        <NavigationSection dataLinks={dataLinks} />

        <div className="px-4 max-w-7xl mx-auto w-full">
          {data.image && (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8 bg-gray-100">
              <Image
                className="object-cover"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                alt={data.title}
                src={data.image}
                priority
              />
            </div>
          )}

          {/* Méta responsable / horaires */}
          {(data.leader || data.schedule) && (
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
              {data.leader && (
                <span className="inline-flex items-center gap-2 bg-[#2d2d83]/5 px-3 py-2 rounded-full">
                  <User className="w-4 h-4 text-[#2d2d83]" />
                  <span>
                    <span className="text-xs text-gray-500">Responsable : </span>
                    <span className="font-medium text-gray-800">{data.leader}</span>
                  </span>
                </span>
              )}
              {data.schedule && (
                <span className="inline-flex items-center gap-2 bg-[#98141f]/5 px-3 py-2 rounded-full">
                  <Clock className="w-4 h-4 text-[#98141f]" />
                  <span>
                    <span className="text-xs text-gray-500">Horaires : </span>
                    <span className="font-medium text-gray-800">{data.schedule}</span>
                  </span>
                </span>
              )}
            </div>
          )}

          {data.content && (
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {data.content}
            </div>
          )}
        </div>

        <FormulaireContact />
        <LastSection />
      </div>
    </div>
  );
}
