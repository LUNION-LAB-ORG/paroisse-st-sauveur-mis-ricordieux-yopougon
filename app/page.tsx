import { Hero } from "@/components/home/hero";
import Services from "@/components/home/services";
import Cure from "@/components/home/cure";
import Evenements from "@/components/home/evenements";
import SelectProgramme from "@/components/home/selectProgramme";
import { getAllEvents } from "@/services/Events/events.action";
import { MorphingSquare } from "@/components/morphing-square";

export default async function  Home() {
  const result=await getAllEvents()
    

  if (result.error) {
    return <div className="text-red-600 h-screen flex items-center justify-center"><MorphingSquare message='Chargement des données...' /></div>;
  }
  const events=result.data.data


  return (
    <div className="overflow-hidden flex flex-col">
      <Hero />
      {/* body */}
      <SelectProgramme />
      <div className="flex flex-col gap-12 pb-16">
        <Services />
        <Cure />
        <Evenements event={events} />
      </div>
    </div>
  );
}
