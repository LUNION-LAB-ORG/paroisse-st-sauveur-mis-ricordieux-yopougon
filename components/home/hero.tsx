import Image from "next/image";
import Link from "next/link";
import { Church, ChevronDown } from "lucide-react";
import { Button } from "@heroui/react";

export function Hero() {
  return (
    <section className="relative h-screen min-h-150 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/1837592/pexels-photo-1837592.jpeg"
          alt="Eglise Saint Sauveur"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#2d2d83]/70 via-[#2d2d83]/50 to-[#98141f]/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
          <Church className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 max-w-4xl">
          Paroisse Saint Sauveur
          <span className="block text-white/80 text-2xl sm:text-3xl md:text-4xl font-normal mt-3">
            Miséricordieux
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
          Une communauté vivante et accueillante à Yopougon Millionnaire.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            variant="primary"
            className="bg-[#98141f] hover:bg-[#7a1019] text-white text-lg px-8 py-4 md:py-8 rounded-xl shadow-lg shadow-[#98141f]/30 min-w-50"
          >
            <Link href="/faire-don" >Faire un don</Link>
          </Button>
          <Button
            variant="ghost"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg px-8 py-4 md:py-8 rounded-xl border border-white/20 min-w-50"
          >
            <Link href="/mouvement">Découvrir</Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/50" />
      </div>

      {/* Bandeau Programme du jour */}
      <div className="absolute bottom-0 w-full flex justify-center z-20">
        <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#2d2d83] px-10 lg:px-16 py-4 lg:py-5 bg-white/95 backdrop-blur-sm rounded-t-2xl shadow-lg">
          Programme du jour
        </div>
      </div>
    </section>
  );
}
