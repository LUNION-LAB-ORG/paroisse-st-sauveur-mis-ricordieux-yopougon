import { HeroCommon } from "@/components/common/hero-common";
import Conseils from "@/components/conseilParoise/conseils";
import Membres from "@/components/conseilParoise/membre";
import Missions from "@/components/conseilParoise/missions";
import NavigationSection from "@/components/mouvement/children/navigationSection";

const txt1 = "Paroisse Saint Sauveur Miséricordieux";
const txt2 = "Chemin de foi, d'amour et d'espérance";
const img = "/assets/images/hero-equipe.jpg";

const dataLinks = [
  {
    name: "Accueil",
    nav: "/",
  },
  {
    name: "Equipes",
    nav: "/equipes",
  },
];

export default function Content() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <HeroCommon img={img} txt1={txt1} txt2={txt2} />
      {/* body */}
      <div className="px-4 max-w-7xl mx-auto flex flex-col gap-8 lg:gap-14 text-xl lg:text-2xl text-stone-600">
        <NavigationSection dataLinks={dataLinks} />
        <Conseils />
        <Missions />
        <Membres />
      </div>
    </div>
  );
}
