const data = [
  {
    programme: "Répétition Chorale",
    heure: "20h00",
    salle: "Salle paroissial",
    jour: "12",
    mois: "MAI",
  },
  {
    programme: "Répétition Chorale",
    heure: "20h00",
    salle: "Salle paroissial",
    jour: "12",
    mois: "MAI",
  },
  {
    programme: "Répétition Chorale",
    heure: "20h00",
    salle: "Salle paroissial",
    jour: "12",
    mois: "MAI",
  },
  {
    programme: "Répétition Chorale",
    heure: "20h00",
    salle: "Salle paroissial",
    jour: "12",
    mois: "MAI",
  },
];

export default function Agenda() {
  return (
    <section className="  ">
      <div className="px-4  max-w-7xl mx-auto">
        <h2 className="text-blue-900 text-center text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-10 lg:mb-16">
          Agenda des prochaines activités
        </h2>

        <div className="mx-auto w-fit lg:w-full  grid  lg:grid-cols-2 gap-4 lg:gap-10">
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className="sm:pr-20 lg:full flex items-center gap-4 sm:gap-10 border-l-8 border-l-blue-900 bg-slate-100 p-5"
              >
                {/* <div className="text-2xl text-center text-muted-foreground mb-4">
                    <h4>{item.jour}</h4>
                    <h5>{item.mois}</h5>
              
                </div> */}

                <div className="text-2xl text-secondary bg-red-800 rounded-md px-6 py-4 sm:py-6 sm:px-10 text-center mb-4">
                  <h4 className="text-secondary font-bold text-3xl md:text-4xl lg:text-5xl">
                    {item.jour}
                  </h4>
                  <h5 className="text-secondary">{item.mois}</h5>
                </div>

                <div className="text-xl lg:text-2xl">
                  <h3 className=" text-blue-900  font-bold mb-2  ">
                    {item.programme}
                  </h3>
                  <h4 className="text-muted-foreground ">
                    <span>{item.heure}</span> - {item.salle}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
