export default function Timeline() {
  const steps = [
    {
      year: "1984",
      title: "Fondation de la paroisse",
      description:
        "Face à l'expansion démographique du quartier, Monseigneur François Dumaine érige officiellement la Paroisse Saint Sauveur Miséricordieux le 12 octobre 1962. Cette décision répond aux besoins spirituels croissants de la population locale et marque le début d'une nouvelle communauté de foi.",
    },
    {
      year: "1984",
      title: "Fondation de la paroisse",
      description:
        "Face à l'expansion démographique du quartier, Monseigneur François Dumaine érige officiellement la Paroisse Saint Sauveur Miséricordieux le 12 octobre 1962. Cette décision répond aux besoins spirituels croissants de la population locale et marque le début d'une nouvelle communauté de foi.",
    },
    {
      year: "1984",
      title: "Fondation de la paroisse",
      description:
        "Face à l'expansion démographique du quartier, Monseigneur François Dumaine érige officiellement la Paroisse Saint Sauveur Miséricordieux le 12 octobre 1962. Cette décision répond aux besoins spirituels croissants de la population locale et marque le début d'une nouvelle communauté de foi.",
    },
  ];

  return (
    <div className="relative  mx-auto py-20 px-4">
      {/* Ligne verticale au centre */}
      <div className="absolute left-1/2 top-0 h-full w-1 bg-gray-300 -translate-x-1/2" />

      <ul className="space-y-24 relative z-10">
        {steps.map((step, index) => {
          const isLeft = index % 2 === 0;

          return (
            <li
              key={index}
              className="flex flex-col md:flex-row items-center relative"
            >
              {/* Colonne gauche */}
              <div className={`md:w-1/2 ${isLeft ? "md:pr-8" : ""}`}>
                {isLeft && (
                  <div className="bg-white dark:bg-muted p-6 rounded shadow w-full text-center md:text-left">
                    <h3 className="text-xl lg:text-2xl text-red-800 font-semibold">
                      {step.title}
                    </h3>
                    <p className="text-blue-900 text-lg lg:text-xl dark:text-muted-foreground mt-2">
                      {step.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Point central (toujours sur la ligne) */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                {/* Point */}
                <div className="w-5 h-5 bg-primary rounded-full border-4 border-white dark:border-muted" />

                {/* Date à gauche ou droite, mais PAS dans le flux du point */}
                <div
                  className={`absolute top-1/2  -translate-y-1/2 text-xl lg:text-2xl font-bold text-primary whitespace-nowrap ${
                    isLeft ? "-left-24 text-right" : "-right-24 text-left"
                  }`}
                >
                  {step.year}
                </div>
              </div>

              {/* Colonne droite */}
              <div className={`md:w-1/2 ${!isLeft ? "md:pl-8" : ""}`}>
                {!isLeft && (
                  <div className="bg-white dark:bg-muted p-6 rounded shadow w-full text-center md:text-start">
                    <h3 className="text-xl lg:text-2xl text-red-800 font-semibold">
                      {step.title}
                    </h3>
                    <p className="text-blue-900 text-lg lg:text-xl  dark:text-muted-foreground mt-2">
                      {step.description}
                    </p>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
