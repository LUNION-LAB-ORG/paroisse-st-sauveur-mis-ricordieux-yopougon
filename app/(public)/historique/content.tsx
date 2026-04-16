import { HeroCommon } from "@/components/common/hero-common";
import Abonnement from "@/components/histoire/abonnement";
import CardHistoire from "@/components/histoire/cures";
import ToggleBody from "@/components/histoire/toggleBody";
import { Pastor } from "@/features/cure/types/cure.type";

const txt1 = "Notre Histoire";
const txt2 =
  "Découvrez le riche héritage de notre paroisse et ceux qui l'ont façonnée au fil des années";
const img = "/assets/images/hero-histoire.jpg";

export default function Content({cure}:{cure:Pastor[]} ) {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <HeroCommon img={img} txt1={txt1} txt2={txt2} />
      <div className="px-4 max-w-7xl mx-auto flex flex-col gap-14">
        <ToggleBody cure={cure} />
        <Abonnement />
      </div>
    </div>
  );
}
