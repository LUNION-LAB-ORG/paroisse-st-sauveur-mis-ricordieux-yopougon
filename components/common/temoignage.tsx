import Image from "next/image";

const data = [
  {
    message:
      "Faire partie de la chorale a transformé ma façon de vivre ma foi. Chanter, c'est prier deux fois, et partager ce moment avec d'autres paroissiens est une véritable joie chaque semaine.",
    name: "Sophie M.",
    role: "Membre de la Chorale",
    image: "/assets/images/avatar-temoin.jpg",
  },
  {
    message:
      "Faire partie de la chorale a transformé ma façon de vivre ma foi. Chanter, c'est prier deux fois, et partager ce moment avec d'autres paroissiens est une véritable joie chaque semaine.",
    name: "Sophie M.",
    role: "Membre de la Chorale",
    image: "/assets/images/avatar-temoin.jpg",
  },
  {
    message:
      "Faire partie de la chorale a transformé ma façon de vivre ma foi. Chanter, c'est prier deux fois, et partager ce moment avec d'autres paroissiens est une véritable joie chaque semaine.",
    name: "Sophie M.",
    role: "Membre de la Chorale",
    image: "/assets/images/avatar-temoin.jpg",
  },
  {
    message:
      "Faire partie de la chorale a transformé ma façon de vivre ma foi. Chanter, c'est prier deux fois, et partager ce moment avec d'autres paroissiens est une véritable joie chaque semaine.",
    name: "Sophie M.",
    role: "Membre de la Chorale",
    image: "/assets/images/avatar-temoin.jpg",
  },
];

export default function Temoignage() {
  return (
    <section className="  ">
      <div className="px-4   max-w-7xl mx-auto">
        <h2 className="text-blue-900 text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-10 lg:mb-16">
          Témoignages
        </h2>

        <div className="grid  lg:grid-cols-2 gap-4 lg:gap-10">
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className="flex flex-col rounded-sm bg-slate-100 p-5"
              >
                <p className="text-2xl text-center text-muted-foreground mb-4">
                  {item.message}
                </p>

                <div className="flex items-center gap-2">
                  <Image
                    className="w-[80px] h-[80px] rounded-full object-cover"
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                  />
                  <div>
                    <h3 className="text-xl lg:text-2xl  font-bold mb-2  ">
                      {item.name}
                    </h3>
                    <p className="text-xl text-muted-foreground ">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
