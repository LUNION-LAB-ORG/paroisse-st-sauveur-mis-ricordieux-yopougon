// app/mouvement/[id]/page.tsx

import { notFound } from "next/navigation";
import Content from "./content";

export type Mouvement = {
  id: string;
  header: {
    image: string;
    title: string;
    description: string;
  };
  nosobjectifs: {
    title: string;
    content: string[];
  };
  nosActivités: {
    title: string;
    content: string[];
  };
  CalendrierEtRéunions: {
    title: string;
    content: string[];
  };
};

// Données fictives

const fakeMouvements: Mouvement[] = [
  {
    id: "1",
    header: {
      image: `/assets/images/mvt-id.jpg`,
      title: `Groupe de Prière Charismatique "Souffle de l'Esprit`,
      description: `L'Équipe d'Animation Liturgique est au service de la beauté et de la dignité des célébrations de notre paroisse Saint Sauveur Miséricordieux. Notre mission est de préparer et d'animer les liturgies pour qu'elles soient des moments de rencontre authentique avec le Seigneur et d'édification pour toute la communauté.
      Notre équipe, composée de laïcs engagés et passionnés par la liturgie, travaille en étroite collaboration avec notre curé et les différents acteurs pastoraux pour que chaque célébration soit vécue comme un temps fort de notre vie paroissiale.`,
    },
    nosobjectifs: {
      title: `Nos Objectifs`,
      content: [
        "Préparer avec soin les célébrations liturgiques tout au long de l'année",
        "Former les différents acteurs de la liturgie (lecteurs, servants d'autel, musiciens...)",
        "Veiller à l'harmonie et à la cohérence des différents éléments liturgiques",
        "Favoriser la participation active de l'assemblée",
        "Enrichir notre répertoire de chants et notre patrimoine liturgique",
      ],
    },
    nosActivités: {
      title: `Nos activités`,
      content: [
        "Préparation des célébrations dominicales et des temps forts liturgiques",
        "Animation musicale des messes et offices",
        "Sessions de formation liturgique pour les paroissiens",
        "Accompagnement des servants d'autel",
        "Organisation des répétitions de la chorale paroissiale",
        "Préparation du matériel et des livrets pour les célébrations spéciales",
      ],
    },
    CalendrierEtRéunions: {
      title: `Calendrier et réunions`,
      content: [
        "Réunion mensuelle de planification :Premier lundi du mois à 20h00 à la salle paroissiale",
        "Répétition de la chorale : Chaque mercredi de 19h30 à 21h30",
        "Formation des lecteurs : Troisième samedi du mois de 10h00 à 12h00",
      ],
    },
  },
];

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return fakeMouvements.map((mouvement) => ({
    id: mouvement.id,
  }));
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const data = fakeMouvements.find((m) => m.id === id);

  if (!data) {
    notFound();
  }

  return (
    <>
      <Content data={data} />
    </>
  );
}
