import Image from "next/image";

const data = [
  {
    title: "Orientation pastorale",
    description:
      "Définir les orientations pastorales de la paroisse en cohérence avec les directives diocésaines et les besoins de la communauté.",
  },
  {
    title: "Orientation pastorale",
    description:
      "Définir les orientations pastorales de la paroisse en cohérence avec les directives diocésaines et les besoins de la communauté.",
  },
  {
    title: "Orientation pastorale",
    description:
      "Définir les orientations pastorales de la paroisse en cohérence avec les directives diocésaines et les besoins de la communauté.",
  },
  {
    title: "Orientation pastorale",
    description:
      "Définir les orientations pastorales de la paroisse en cohérence avec les directives diocésaines et les besoins de la communauté.",
  },
  {
    title: "Orientation pastorale",
    description:
      "Définir les orientations pastorales de la paroisse en cohérence avec les directives diocésaines et les besoins de la communauté.",
  },
];

export default function Missions() {
  return (
    <div>
      <h2 className="text-blue-900 text-3xl md:text-4xl lg:text-5xl font-bold mb-8 lg:mb-14">
        Missions du Conseil Paroissial
      </h2>
      <div className="bg-blue-50 rounded-xl p-4 lg:p-16 flex flex-col gap-8">
        {data.map((item, index) => {
          return (
            <div key={index} className="flex flex-col lg:flex-row gap-5">
              <div className="bg-blue-100 p-5 w-fit h-fit rounded-xl">
                <Image
                  alt="Document"
                  className="w-6 h-6 lg:w-14 lg:h-10"
                  height={10}
                  src="/assets/icons/Document.png"
                  width={10}
                />
              </div>
              <div>
                <h3 className="text-red-800 font-bold mb-4">{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
