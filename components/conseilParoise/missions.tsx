import Image from "next/image";

const data = [
  {
    title: "Orientation pastorale",
    description:
      "Définir les orientations pastorales de la paroisse en cohérence avec les directives diocésaines et les besoins de la communauté.",
  },
  {
    title: "Accompagnement des fidèles",
    description:
      "Mettre en place des actions concrètes pour soutenir les familles, les jeunes, les personnes âgées et les plus démunis.",
  },
  {
    title: "Vie liturgique",
    description:
      "Encourager la participation active des fidèles aux célébrations et valoriser les temps forts liturgiques de l’année.",
  },
  {
    title: "Communication",
    description:
      "Favoriser la communication interne et externe à travers des outils modernes et accessibles.",
  },
  {
    title: "Formation chrétienne",
    description:
      "Proposer des parcours de catéchèse et de formation pour tous les âges afin de grandir dans la foi.",
  },
];

export default function Missions() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-10 text-center">
          Missions du Conseil Paroissial
        </h2>

        <div className="bg-blue-50 rounded-xl p-6 sm:p-8 lg:p-12 flex flex-col gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
            >
              <div className="bg-blue-100 p-3 sm:p-4 rounded-xl flex-shrink-0">
                <Image
                  alt="Document"
                  src="/assets/icons/Document.png"
                  width={32}
                  height={32}
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>

              <div>
                <h3 className="text-red-800 text-lg sm:text-xl font-semibold mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-3xl">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
