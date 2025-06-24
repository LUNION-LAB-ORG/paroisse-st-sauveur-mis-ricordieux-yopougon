"use client";
import BodyActualites from "@/components/actualites/body-actualites";
import { HeroCommon } from "@/components/common/hero-common";

const txt1 = "Actualités de la Paroisse";
const txt2 =
  "estez informé de la vie et des événements de la Paroisse Saint Sauveur Miséricordieux";
const img = "/assets/images/hero-actualite.jpg";

export default function Content() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <HeroCommon img={img} txt1={txt1} txt2={txt2} />
      <BodyActualites />
    </div>
  );
}
