import { HeroCommon } from "@/components/common/hero-common";
import CardMeditation from "@/components/meditation/CardMeditation";

const txt1 = "Paroisse Saint Sauveur Miséricordieux";
const txt2 = "« Être témoin de l'amour du Christ dans notre communauté »";
const img = "/assets/images/hero-meditation.jpg";

export default function Content() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <HeroCommon img={img} txt1={txt1} txt2={txt2} />
      <CardMeditation />
    </div>
  );
}
