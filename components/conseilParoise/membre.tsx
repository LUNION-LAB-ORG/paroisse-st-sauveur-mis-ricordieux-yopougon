const data = [
  {
    name: "Père Jean Dupont",
    role: "Curé, Président du Conseil",
    description:
      "Responsable de coordonner l'ensemble des activités pastorales et de veiller à l'unité de la communauté paroissiale.",
  },
  {
    name: "Père Jean Dupont",
    role: "Curé, Président du Conseil",
    description:
      "Responsable de coordonner l'ensemble des activités pastorales et de veiller à l'unité de la communauté paroissiale.",
  },
  {
    name: "Père Jean Dupont",
    role: "Curé, Président du Conseil",
    description:
      "Responsable de coordonner l'ensemble des activités pastorales et de veiller à l'unité de la communauté paroissiale.",
  },
  {
    name: "Père Jean Dupont",
    role: "Curé, Président du Conseil",
    description:
      "Responsable de coordonner l'ensemble des activités pastorales et de veiller à l'unité de la communauté paroissiale.",
  },
];

export default function Membres() {
  return (
    <div>
      <h2 className="text-blue-900 text-3xl md:text-4xl lg:text-5xl font-bold mb-8 lg:mb-14">
        Membres du Conseil Paroissial
      </h2>

      <div className="grid lg:grid-cols-2 gap-10 ">
        {data.map((item, index) => {
          return (
            <div key={index}>
              <div className="mb-4 lg:mb-8 bg-red-800 rounded-t-[50px] text-center py-6 lg:py-8 text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                {item.name}
              </div>
              <h3 className="mb-6 lg:mb-10 text-xl md:text-xl lg:text-2xl xl:text-3xl">
                {item.role}
              </h3>
              <p>{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
