import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-[60vh] sm:h-[100vh] md:h-[50vh] lg:h-screen overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/1837592/pexels-photo-1837592.jpeg"
          alt="Église Saint Michel"
          fill
          priority
          className="object-cover brightness-[0.5]"
        />
      </div>

      {/* Contenu superposé centré */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-10">
        <div className="text-white text-center max-w-3xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug mb-6 font-cinzel">
            Bienvenue à la Paroisse Saint Sauveur Miséricordieux
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-light opacity-90 mb-8 leading-relaxed">
            Une communauté vivante et accueillante à Yopougon Millionnaire.
          </p>
          <Link href="/faire-don" className="font-medium">
            <Button
              className="text-sm sm:text-base md:text-lg px-6 sm:px-10 py-3 sm:py-4 border-white text-white hover:bg-white hover:text-blue-900 rounded-full transition-all shadow-lg"
              variant="bordered"
            >
              Faire un don
            </Button>
          </Link>
        </div>
      </div>

      {/* Bandeau bas visible en permanence */}
      <div className="absolute bottom-0 w-full flex justify-center z-20">
        <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-900 px-6 md:px-16 py-4 bg-white bg-opacity-90 rounded-t-xl shadow-xl">
          Programme du jour
        </div>
      </div>
    </section>
  );
}
