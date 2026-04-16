import { Hero } from "@/components/home/hero";
import Services from "@/components/home/services";
import Cure from "@/components/home/cure";
import Evenements from "@/components/home/evenements";
import SelectProgramme from "@/components/home/selectProgramme";
import { apiServer } from "@/lib/api";

export default async function Home() {
  let events: any[] = [];
  try {
    const result = await apiServer.get("/events", undefined, "public");
    events = result?.data ?? [];
  } catch {
    events = [];
  }

  return (
    <div className="overflow-hidden flex flex-col">
      <Hero />
      <SelectProgramme />
      <div className="flex flex-col gap-12 pb-16">
        <Services />
        <Cure />
        <Evenements event={events} />
      </div>
    </div>
  );
}
