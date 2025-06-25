const dataPrix = [
  { id: 1, prix: "500 FCFA" },
  { id: 2, prix: "1000 FCFA" },
  { id: 3, prix: "1500 FCFA" },
  { id: 4, prix: "2000 FCFA" },
  { id: 5, prix: "5000 FCFA" },
  { id: 6, prix: "Autre" },
];

function MoneyIcon() {
  return (
    <svg
      className="w-6 h-6 text-blue-600 group-hover:text-blue-900"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 1v22M17 5H9a4 4 0 1 0 0 8h6a4 4 0 1 1 0 8H7" />
    </svg>
  );
}

export default function FaireDon() {
  return (
    <section className="w-full px-4 bg-white max-w-6xl mx-auto py-14">
      <div className="text-center">
        <h2 className="text-blue-900 uppercase text-xl sm:text-2xl md:text-3xl font-bold tracking-wide mb-4">
          Faire un don
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mb-12">
          Soutenez notre paroisse en faisant un don. Choisissez un montant ci-dessous ou entrez un montant personnalisé.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-6">
        {dataPrix.map((item) => (
          <div
            key={item.id}
            className="group border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 flex items-center gap-3 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-blue-600"
          >
            <MoneyIcon />
            <h4 className="text-base sm:text-lg font-semibold text-blue-800 group-hover:text-blue-900">
              {item.prix}
            </h4>
          </div>
        ))}
      </div>

      {/* <div className="text-center mt-10">
        <button className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-full transition">
          Valider le don
        </button>
      </div> */}
    </section>
  );
}
