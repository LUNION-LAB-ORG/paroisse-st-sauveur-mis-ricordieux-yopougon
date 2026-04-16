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
    collectes: "54% collectés",
    image: "/assets/images/projet-en-cours.jpg",
    link: "",
  },
  {
    title: "Rénovation de la chapelle",
    description:
      "Restauration des vitraux, réfection de la toiture et mise aux normes électriques",
    collectes: "32% collectés",
    image: "/assets/images/projet-en-cours.jpg",
    link: "",
  },
  {
    title: "Aide aux plus démunis",
    description:
      "Soutien alimentaire, accompagnement social et actions caritatives pour les familles",
    collectes: "78% collectés",
    image: "/assets/images/projet-en-cours.jpg",
    link: "",
  },
];

export default function Content() {
  return (
    <div className="flex flex-col pb-16">
      <HeroCommon btnRetour={true} img={img} txt1={txt1} txt2={txt2} />
      {/* body */}
      <div className="flex flex-col gap-10 lg:gap-14 px-4 max-w-4xl mx-auto w-full pt-10 lg:pt-14">
        <FaireDon />
        <AffectationDon />
        <CardContainer dataContainer={data} txt1="Nos projets en cours" />
      </div>
    </div>
  );
}
