"use client";
import BodyActualites from "@/components/actualites/body-actualites";
import { HeroCommon } from "@/components/common/hero-common";
import { NewsType } from "@/services/news/news.schema";
import { NewsItemType } from "@/services/news/types/cure.type";


const txt1 = "Actualités de la Paroisse";
const txt2 =
  "estez informé de la vie et des événements de la Paroisse Saint Sauveur Miséricordieux";
const img = "/assets/images/hero-actualite.jpg";

export default function Content({news}:{news:NewsItemType[]}  ) {
  
  return (
    <div className="flex flex-col gap-12 pb-16">
      <HeroCommon img={img} txt1={txt1} txt2={txt2} />
      <BodyActualites news={news} />
    </div>
  );
}
