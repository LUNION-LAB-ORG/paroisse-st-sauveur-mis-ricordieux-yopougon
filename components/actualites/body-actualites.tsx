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
    date: "22 Avril ",
    heure: "09h00",
    lieux: "Église",
    image: "/assets/images/evenement.jpg",
    link: "/actualites/1",
  },
  {
    title: "Grande Messe du 3ème dimanche de Pâques",
    description:
      "Célébration présidée par Monseigneur l'Archevêque dans le cadre de sa visite pastorale.",
    date: "22 Avril ",
    heure: "09h00",
    lieux: "Église",
    image: "/assets/images/evenement.jpg",
    link: "/actualites/1",
  },
  {
    title: "Grande Messe du 3ème dimanche de Pâques",
    description:
      "Célébration présidée par Monseigneur l'Archevêque dans le cadre de sa visite pastorale.",
    date: "22 Avril ",
    heure: "09h00",
    lieux: "Église",
    image: "/assets/images/evenement.jpg",
    link: "/actualites/1",
  },
];

const txt1 = "Annonces importantes";

const txt2 = "Toutes les actualités";

export default function BodyActualites() {
  return (
    <section>
      <div className="px-2 sm:px-4 max-w-7xl mx-auto flex flex-col gap-16">
        <FilterActualites />
        <CardContainer dataContainer={data} txt1={txt1} />
        <CardContainer dataContainer={data} txt1={txt2} />
      </div>
    </section>
  );
}
