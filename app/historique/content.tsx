import { HeroCommon } from "@/components/common/hero-common";
import Abonnement from "@/components/histoire/abonnement";
import CardHistoire from "@/components/histoire/cures";
import ToggleBody from "@/components/histoire/toggleBody";

const txt1 = "Notre Histoire";
const txt2 =
  "Découvrez le riche héritage de notre paroisse et ceux qui l'ont façonnée au fil des années";
const img = "/assets/images/hero-histoire.jpg";

export default function Content() {
  return (
    <div className="flex flex-col">
      <HeroCommon img={img} txt1={txt1} txt2={txt2} />

      {/* body */}
      {/* <div className="my-10 lg:my-16 px-4 max-w-7xl mx-auto flex flex-col gap-14 text-stone-600 text-xl md:text-2xl "> */}
      <ToggleBody />
      <Abonnement />
      {/* </div> */}
    </div>
  );
}
