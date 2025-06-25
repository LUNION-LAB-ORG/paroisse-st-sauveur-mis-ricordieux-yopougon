import { Button } from "@heroui/button";
import Link from "next/link";

export default function Organisation() {
  return (
    <section className="py-10 sm:py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-12">
        {/* Section Titre */}
        <div className="text-center px-2">
          <h2 className="text-blue-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Organisation Paroissiale
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Découvrez les personnes qui œuvrent au service de notre communauté à la
            <strong className="text-blue-900"> Paroisse Saint Sauveur Miséricordieux</strong>.
            Notre organisation comprend l'équipe pastorale et les différents conseils
            qui accompagnent notre paroisse dans sa mission d'évangélisation et de service.
          </p>
        </div>

        {/* Section Boutons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 px-2">
          <Button
            className="rounded-full text-sm sm:text-base font-semibold py-3 px-6 shadow-md w-full sm:w-auto"
            color="primary"
          >
            Équipe Paroissiale
          </Button>

          <Link href="/conseils-paroissiaux" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              className="w-full sm:w-auto border-2 border-red-800 text-red-800 hover:bg-red-800 hover:text-white rounded-full text-sm sm:text-base font-semibold py-3 px-6 transition"
            >
              Conseils Paroissiaux
            </Button>
          </Link>
        </div>

        {/* Description finale */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mx-2 text-center">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Notre équipe pastorale est composée de prêtres, de diacres et de laïcs engagés.
            Ensemble, ils assurent la vie sacramentelle, l'accompagnement des fidèles et la
            gestion de la paroisse dans un esprit de service et de fraternité.
          </p>
        </div>

        {/* Valeurs ajoutées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
          {[
            {
              title: "Mission",
              text: "Annoncer l’Évangile et faire grandir la foi des fidèles.",
            },
            {
              title: "Fraternité",
              text: "Accueillir chacun avec bienveillance et construire une communauté unie.",
            },
            {
              title: "Engagement",
              text: "Mettre ses dons au service de Dieu et de l’Église locale.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="text-blue-900 font-semibold text-base mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600 break-words">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
