import CardContainer from "./card-container";
import FilterActualites from "./filterActualites";

export interface EvenementType {
  title: string;
  description: string;
  date: string;
  heure: string;
  lieux: string;
  image: string;
  link: string;
}

const data: EvenementType[] = [
  {
    title: "Grande Messe du 3ème dimanche de Pâques",
    description:
      "Célébration présidée par Monseigneur l'Archevêque dans le cadre de sa visite pastorale.",
    date: "22 Avril",
    heure: "09h00",
    lieux: "Église",
    image: "/assets/images/evenement.jpg",
    link: "/actualites/1",
  },
  {
    title: "Vigile Pascale - Messe de la Lumière",
    description:
      "Une veillée de prière et de méditation précédant la messe solennelle de la Résurrection.",
    date: "20 Avril",
    heure: "20h00",
    lieux: "Parvis de l'Église",
    image: "/assets/images/evenement.jpg",
    link: "/actualites/2",
  },
  {
    title: "Chemin de Croix communautaire",
    description:
      "Un moment de recueillement autour de la Passion du Christ, animé par les jeunes de la paroisse.",
    date: "18 Avril",
    heure: "17h00",
    lieux: "Départ: Salle paroissiale",
    image: "/assets/images/evenement.jpg",
    link: "/actualites/3",
  },
];

const txt1 = "Annonces importantes";
const txt2 = "Toutes les actualités";

export default function BodyActualites() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-24">
        {/* Filtres */}
        <div className="w-full">
          <FilterActualites />
        </div>

        {/* Section 1 : Annonces importantes */}
        <div>
          <h2 className="text-blue-900 text-3xl lg:text-4xl font-bold mb-8">
            {txt1}
          </h2>
          <CardContainer dataContainer={data} txt1={""} />
        </div>

        {/* Section 2 : Toutes les actualités */}
        <div>
          <h2 className="text-blue-900 text-3xl lg:text-4xl font-bold mb-8">
            {txt2}
          </h2>
          <CardContainer dataContainer={data} txt1={""} />
        </div>
      </div>
    </section>
  );
}
