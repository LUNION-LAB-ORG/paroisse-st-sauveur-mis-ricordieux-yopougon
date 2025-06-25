"use client";
import { HeroCommon } from "@/components/common/hero-common";
import LastSection from "@/components/equipe/lastSection";
import Organisation from "@/components/equipe/organisation";
import TabsProgrammes from "@/components/equipe/tabsProgrammes";

const txt1 = "Paroisse Saint Sauveur Miséricordieux";
const txt2 = "Chemin de foi, d'amour et d'espérance";
const img = "/assets/images/hero-equipe.jpg";

export default function Content() {
  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 lg:gap-16">
      <HeroCommon img={img} txt1={txt1} txt2={txt2} />
      <div className="overflow-hidden max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8 lg:gap-14 text-base sm:text-lg lg:text-xl text-stone-600">
        /<Organisation />
        <TabsProgrammes />
        <LastSection />
      </div>
    </div>
  );
}
