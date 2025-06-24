import Image from "next/image";

export default function Cure() {
  return (
    <section className="px-6 max-w-6xl mx-auto py-16">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden lg:flex">
        {/* Image à gauche */}
        <div className="relative w-full lg:w-1/2 h-[300px] lg:h-auto">
          <Image
            src="/assets/images/cure.jpg"
            alt="Photo du Curé"
            fill
            className="object-cover"
          />
        </div>

        {/* Texte à droite */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <h2 className="text-blue-900 text-3xl md:text-4xl font-extrabold mb-6">
              Le Mot du Curé
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed space-y-4">
              <span className="block font-medium mb-2">Chers frères et sœurs en Christ,</span>

              <span className="block mb-4">
                C'est avec une immense joie que je vous accueille sur le site
                internet de notre paroisse <strong>Saint Sauveur Miséricordieux</strong>.
                Ce nouvel outil de communication nous permettra de renforcer les
                liens qui nous unissent et de partager plus facilement les informations
                importantes de notre vie paroissiale.
              </span>

              <span className="block mb-4">
                Notre communauté se veut <strong>fraternelle et ouverte à tous</strong>.
                Chacun y a sa place et peut apporter sa pierre à l'édifice que nous
                construisons ensemble, à l'image de notre église dont les travaux
                avancent grâce à votre <em>générosité</em> et votre <em>engagement</em>.
              </span>

              <span className="block mb-4">
                En ces temps parfois difficiles, notre paroisse se veut un lieu
                d'<strong>espérance</strong>, de réconfort et de partage.
              </span>

              <span className="block font-semibold text-blue-900 mt-6">
                Que Dieu vous bénisse, <br />
                <span className="block mt-2">Père Jean-Baptiste KOFFI, Curé</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
