import Image from "next/image";

const dataEquipes = [
  {
    id: 1,
    nom: "Jean Dupont",
    image: "/assets/images/avatar-temoin.jpg",
    description: "Responsable de l'équipe",
  },
  {
    id: 2,
    nom: "Jean Dupont",
    image: "/assets/images/avatar-temoin.jpg",
    description: "Responsable de l'équipe",    
  },
  {
    id: 3,
    nom: "Jean Dupont",
    image: "/assets/images/avatar-temoin.jpg",
    description: "Responsable de l'équipe",
  }
]

export default function MouvementEquipes() {
  return (
    <div className="w-full text-stone-600 px-4 max-w-7xl mx-auto text-xl md:text-2xl  ">
        <h2 className="font-cinzel text-blue-900 text-2xl md:text-3xl lg:text-4xl font-bold pb-10 lg:pb-16 !leading-relaxed ">
          Notre équipe
        </h2>

      <div className="grid md:grid-cols-3 gap-10 mb-10">
        {
          dataEquipes.map((equipe) => (
            <div key={equipe.id} className="bg-blue-50 p-10 flex flex-col gap-4 items-center">
              <Image
              width={1400}
              height={1400}
               src={equipe.image}
                alt={equipe.nom}
                 className="w-56 rounded-full" />
              <div className="w-full text-center ">
                <h2 className="text-blue-900 text-xl md:text-3xl lg:text-3xl font-bold">{equipe.nom}</h2>
                <p className="text-xl md:text-2xl font-semibold">{equipe.description}</p>
              </div>
            </div>
          ))
        }

      </div>
      <p className="text-center">
     {` Nous sommes toujours heureux d'accueillir de nouveaux membres dans notre équipe ! Que vous ayez des talents musicaux, une belle voix, un intérêt pour la liturgie ou simplement l'envie de servir la communauté, n'hésitez pas à nous contacter.`}
      </p>
    </div>
  );
}