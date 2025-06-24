"use client";
import Image from "next/image";
import { useState } from "react";

const listButton = [
  {
    label: "Conseil Paroissial",
    value: "conseilParoissial",
  },
  {
    label: "Conseil pour les Affaires Économiques",
    value: "conseilAffaires",
  },
];

export default function Conseils() {
  const [table, setTable] = useState("conseilParoissial");

  const handlerTable = (value: string) => {
    setTable(value);
  };

  return (
    <div className=" flex flex-col gap-8 lg:gap-14">
      <div className="text-center">
        <h2 className="text-blue-900 text-3xl md:text-4xl lg:text-5xl font-bold mb-8 lg:mb-14">
          Conseils Paroissiaux
        </h2>
        <p>
          {` Découvrez les structures de gouvernance qui accompagnent notre paroisse dans sa mission pastorale et sa gestion économique. Ces conseils, composés de clercs et de laïcs, œuvrent ensemble pour le bien de notre communauté.`}
        </p>
      </div>
      {/* div btn */}
      <div className="lg:px-20 flex justify-between items-center  sm:text-xl lg:text-3xl">
        {listButton.map((item, index) => {
          return (
            <button
              key={index}
              className={`${table == item.value ? "border-b-red-700 border-b-4 text-red-700" : ""}`}
              onClick={() => handlerTable(item.value)}
            >
              {`${item.label}`}
            </button>
          );
        })}
      </div>
      {/* content */}
      <div className="px-2">
        <div className=" bg-red-50 border-l-8 border-l-red-800 p-8 flex flex-col  gap-8">
          <div className="bg-blue-100 p-5 w-fit rounded-xl">
            <Image
              alt="Document"
              className="w-10 h-10"
              height={10}
              src="/assets/icons/Document.png"
              width={10}
            />
          </div>

          <h3 className="font-bold text-red-800">{`Le Conseil Paroissial`}</h3>
          <p>
            {`
            Le Conseil Paroissial est un organe consultatif qui assiste le curé dans sa mission pastorale. Il réfléchit aux orientations de la paroisse, propose des initiatives pour favoriser la vie chrétienne et évalue les activités pastorales déjà existantes.
Ce conseil se réunit environ tous les deux mois et est composé de membres représentant les différentes réalités de notre communauté.
            `}
          </p>
        </div>
      </div>

      <p>
        {`
  Notre équipe pastorale est composée de prêtres et de diacres engagés au service de notre communauté. Chacun d'eux met ses talents et son charisme particulier au service de l'annonce de l'Évangile et de l'accompagnement spirituel des fidèles.`}
      </p>
    </div>
  );
}
