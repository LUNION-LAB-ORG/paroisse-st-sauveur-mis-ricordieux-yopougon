import { HeroCommon } from "@/components/common/hero-common";
import AffectationDon from "@/components/faireDon/affectationDon";
import CardContainer from "@/components/faireDon/CardContainer";
import FaireDon from "@/components/faireDon/faireDon";

const txt1 = "Soutenir Paroisse Saint Sauveur Miséricordieux";
const txt2 =
  "Votre générosité permet à notre communauté de grandir et de servir.";
const img = "/assets/images/hero-faire-don.jpg";

export interface ProjetEnCour {
  title: string;
  description: string;
  collectes: string;
  image: string;
  link: string;
}

const data: ProjetEnCour[] = [
  {
    title: "Fonctionnement général de la paroisse",
    description:
      "Entretien des locaux, chauffage, électricité et frais quotidiens",
    collectes: "54% collectés ",
    image: "/assets/images/projet-en-cours.jpg",
    link: "",
  },
  {
    title: "Fonctionnement général de la paroisse",
    description:
      "Entretien des locaux, chauffage, électricité et frais quotidiens",
    collectes: "54% collectés ",
    image: "/assets/images/projet-en-cours.jpg",
    link: "",
  },
  {
    title: "Fonctionnement général de la paroisse",
    description:
      "Entretien des locaux, chauffage, électricité et frais quotidiens",
    collectes: "54% collectés ",
    image: "/assets/images/projet-en-cours.jpg",
    link: "",
  },
];

export default function Content() {
  return (
    <div className="flex flex-col gap-12 lg:gap-20 pb-16 ">
      <HeroCommon btnRetour={true} img={img} txt1={txt1} txt2={txt2} />
      {/* body */}
      <div className="flex flex-col gap-8 lg:gap-16 px-4 max-w-7xl mx-auto">
        <FaireDon />
        <AffectationDon />
        <CardContainer dataContainer={data} txt1="Nos projets en cours" />
      </div>
    </div>
  );
}
