import Image from "next/image";

// import Link from "next/link";
import BtnRetour from "./btn-retour";

interface Props {
  txt1: string;
  txt2: string;
  img: string;
  btnRetour?: boolean;
}

export function HeroCommon({ txt1, txt2, img, btnRetour = false }: Props) {
  return (
    <div className="relative h-[60vh] sm:h-[100vh] md:h-[50vh] lg:h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="relative hh-screen h-full w-full">
          <Image
            fill
            priority
            alt="Église Saint Michel"
            className="object-cover brightness-[0.4]"
            src={img}
          />
        </div>
      </div>

      {btnRetour && <BtnRetour />}

      <div className="px-4 max-w-7xl mx-auto relative mt-[150px] z-10 py-20 md:py-32 text-white">
        <div className="max-w-4xl">
          <h1 className="font-cinzel text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6 !leading-relaxed ">
            {txt1}
          </h1>

          <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
            {txt2}
          </p>
        </div>
      </div>
    </div>
  );
}
