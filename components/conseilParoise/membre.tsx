const data = [
  {
    name: "Père Jean Dupont",
    role: "Curé, Président du Conseil",
    description:
      "Responsable de coordonner l'ensemble des activités pastorales et de veiller à l'unité de la communauté paroissiale.",
  },
  {
    name: "Sœur Marie Claire",
    role: "Responsable de la catéchèse",
    description:
      "Accompagne les enfants dans leur parcours de foi et coordonne les programmes catéchétiques de la paroisse.",
  },
  {
    name: "Jean-Baptiste Martin",
    role: "Diacre permanent",
    description:
      "Participe à l'animation liturgique et à l'accompagnement spirituel des familles et des malades.",
  },
  {
    name: "Anne Dupuis",
    role: "Coordinatrice des bénévoles",
    description:
      "Organise et soutient les actions des bénévoles impliqués dans les services paroissiaux.",
  },
];

export default function Membres() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center">
          Membres du Conseil Paroissial
        </h2>

        <div className="grid gap-10 sm:gap-12 md:grid-cols-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full"
            >
              <div className="bg-red-800 text-white text-center px-6 py-6 sm:py-8 rounded-t-xl text-lg sm:text-xl md:text-2xl font-semibold">
                {item.name}
              </div>

              <div className="p-6 sm:p-8 flex flex-col gap-4 text-gray-700">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-red-800">
                  {item.role}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed">
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
