import { Hero } from "@/components/home/hero";
import Services from "@/components/home/services";
import Cure from "@/components/home/cure";
import Evenements from "@/components/home/evenements";
import SelectProgramme from "@/components/home/selectProgramme";

export default function Home() {
  return (
    <div className="overflow-hidden flex flex-col">
      <Hero />
      {/* body */}
      <SelectProgramme />
      <div className="flex flex-col gap-12 pb-16">
        <Services />
        <Cure />
        <Evenements />
      </div>
    </div>
  );
}
