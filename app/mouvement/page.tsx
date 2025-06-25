import { HeroCommon } from "@/components/common/hero-common";
import Temoignage from "@/components/common/temoignage";
import Agenda from "@/components/mouvement/agenda-activites";
import Paroisse from "@/components/mouvement/paroise";

const txt1 = "Paroisse Saint Sauveur Miséricordieux";
const txt2 = "« Être témoin de l'amour du Christ dans notre communauté »";
const img = "/assets/images/hero-paroise.jpg";

export default function MouvementPage() {
  return (
    <div className="flex flex-col gap-12 lg:gap-20 pb-10">
      <HeroCommon img={img} txt1={txt1} txt2={txt2} />
      <Paroisse />
      <Temoignage />
      <Agenda />
    </div>
  );
}
