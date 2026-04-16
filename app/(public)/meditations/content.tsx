import { HeroCommon } from "@/components/common/hero-common";
import CardMeditation from "@/components/meditation/CardMeditation";

const txt1 = "Méditations";
const txt2 = "Nourrissez votre foi au quotidien avec nos méditations et réflexions spirituelles.";
const img = "/assets/images/hero-meditation.jpg";

export default function Content() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <HeroCommon img={img} txt1={txt1} txt2={txt2} />
      <div className="px-4 max-w-7xl mx-auto w-full">
        <CardMeditation />
      </div>
    </div>
  );
}
