import Image from "next/image";
import { Card } from "@heroui/react";
import { Quote } from "lucide-react";

export default function Cure() {
  return (
    <section className="px-6 lg:px-[100px] max-w-[1440px] mx-auto">
      <div className="text-center mb-12">
        <p className="text-[#98141f] text-sm font-semibold uppercase tracking-widest mb-3">
          Notre berger
        </p>
        <h2 className="text-[#2d2d83] text-2xl sm:text-3xl lg:text-4xl font-bold">
          Le Mot du Curé
        </h2>
      </div>

      <Card className="overflow-hidden">
        <Card.Content className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Texte */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <Quote className="w-10 h-10 text-[#98141f]/20 mb-6" />
              <div className="text-gray-600 text-base lg:text-lg leading-relaxed space-y-4">
                <p>Chers frères et sœurs en Christ,</p>
                <p>
                  C&apos;est avec une immense joie que je vous accueille sur le site de notre paroisse{" "}
                  <strong className="font-semibold text-[#2d2d83]">
                    Saint Sauveur Miséricordieux
                  </strong>
                  . Ce nouvel outil nous permettra de renforcer les liens qui nous unissent et de partager les informations importantes de notre vie paroissiale.
                </p>
                <p>
                  Notre communauté se veut{" "}
                  <strong className="font-semibold">fraternelle et ouverte à tous</strong>.
                  Chacun y a sa place et peut apporter sa pierre à l&apos;édifice que nous construisons ensemble.
                </p>
                <p>
                  Que Dieu vous bénisse et que Saint Sauveur Miséricordieux intercède pour vous et vos familles.
                </p>
              </div>
              <p className="mt-6 text-[#2d2d83] font-semibold italic">
                Père Jean-Baptiste KOFFI, Curé
              </p>
            </div>

            {/* Image */}
            <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-[500px]">
              <Image
                src="/assets/images/cure.jpg"
                alt="Père Jean-Baptiste KOFFI"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d2d83]/20 to-transparent lg:bg-gradient-to-r lg:from-[#2d2d83]/10 lg:to-transparent" />
            </div>
          </div>
        </Card.Content>
      </Card>
    </section>
  );
}
