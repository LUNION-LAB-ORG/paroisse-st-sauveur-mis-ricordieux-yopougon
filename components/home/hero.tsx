import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <div className="relative hh-screen h-full w-full">
          <Image
            fill
            priority
            alt="Église Saint Michel"
            className="object-cover brightness-[0.4]"
            src="https://images.pexels.com/photos/1837592/pexels-photo-1837592.jpeg"
          />
          <div className="absolute bottom-0 w-full flex justify-center">
            <div className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-blue-900 mb-1 px-10 lg:px-44 py-10 rounded-t-xl bg-white ">
              Progamme du jour
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-7xl mx-auto relative mt-[100px] z-10 py-20 md:py-32 text-white">
        <div className="max-w-5xl">
          <h1 className="font-cinzel text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6 !leading-relaxed ">
            Bienvenue à la Paroisse Saint Sauveur Miséricordieux
          </h1>

          <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
            Une communauté vivante et accueillante à Yopougon Millionnaire.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="border-white w-fit text-2xl border px-10 py-8 sm:py-10 sm:px-14 text-white hover:bg-white/20"
              size="lg"
              variant="bordered"
            >
              <Link href="#horaires">Faire un don</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
