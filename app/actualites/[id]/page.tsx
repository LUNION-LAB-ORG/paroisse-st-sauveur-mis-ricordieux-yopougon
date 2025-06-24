// app/mouvement/[id]/page.tsx

import { notFound } from "next/navigation";

import Content from "./content";

type ActualitésId = {
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

const fakeMouvements: ActualitésId[] = [
  {
    id: "1",
    header: {
      image: `/assets/images/mvt-id.jpg`,
      title: `Inscription au pèlerinage paroissial à Notre-Dame de Lourdes`,
      description: `Les inscriptions pour le pèlerinage à Notre-Dame de Lourdes sont désormais ouvertes à tous les paroissiens.
       Ce temps fort de notre année paroissiale nous permettra de nous rassembler autour de Marie et de vivre ensemble des moments
        de prière, de partage et de fraternité. Informations pratiquesLe pèlerinage aura lieu du 12 au 16 juin 2025.
         Le départ se fera en car depuis le parvis de l'église à 6h00 le matin du 12 juin.`,
    },
    nosobjectifs: {
      title: `Le programme comprendra :`,
      content: [
        "Participation aux processions mariales",
        "Messes quotidiennes",
        "Temps de confession",
        "Chemin de croix",
        "Visite des lieux importants de Lourdes",
        "Temps libre pour la prière personnelle aux grottes",
      ],
    },
    nosActivités: {
      title: `Modalités d'inscription`,
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

export default async function Page({ params }: PageProps)  {
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

// export default async function Page({ params }: Props) {
//   const data = fakeMouvements.find((m) => m.id === params.id);

//   if (!data) {
//     notFound();
//   }

//   return (
//     <>
//       <Content data={data} />
//     </>
//   );
// }
