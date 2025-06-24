const dataPrix = [
  {
    id: 1,
    prix: "500 FCFA",
  },
  {
    id: 2,
    prix: "1000 FCFA",
  },
  {
    id: 3,
    prix: "500 FCFA",
  },
  {
    id: 4,
    prix: "1000 FCFA",
  },
  {
    id: 5,
    prix: "2000 FCFA",
  },
  {
    id: 6,
    prix: "Autre",
  },
];

export default function FaireDon() {
  return (
    <section>
      <div>
        <h2 className="text-blue-900 text-3xl md:text-4xl lg:text-5xl font-bold mb-10 lg:mb-14">
          Faire un don
        </h2>
        {/* card montant faire don */}
        <div>
          <h3 className="text-blue-900 text-2xl md:text-3xl lg:text-4xl font-bold mb-10">
            Montant du don
          </h3>

          <div className="grid md:grid-cols-3 gap-5">
            {dataPrix.map((item) => {
              return (
                <div
                  key={item.id}
                  className="hover:bg-blue-50  border rounded-lg shadow-md p-7 py-12"
                >
                  <h4 className="text-xl lg:text-4xl hover:text-blue-900 text-center">
                    {item.prix}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
