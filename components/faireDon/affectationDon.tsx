import Link from "next/link";
import { Button } from "@heroui/button";

import SelectDon from "./selectDon";

export default function AffectationDon() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-6 py-12">
      <div className="bg-white max-w-4xl w-full rounded-3xl shadow-xl p-14 md:p-20 text-stone-700">
        <h2 className="text-blue-900 uppercase font-serif font-semibold text-3xl md:text-4xl mb-8 tracking-wide text-center">
          Affectation du Don
        </h2>

        <SelectDon />

        <p className="text-center italic text-gray-500 text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed">
          Projet de restauration du clocher de notre église historique.
        </p>

        <div className="flex justify-center">
          <Link href="/faire-don/paiement" className="w-full md:w-auto">
            <Button
              color="primary"
              className="w-full md:w-auto py-5 px-20 rounded-full text-lg font-semibold shadow-md transition duration-300 hover:shadow-lg hover:bg-blue-700"
            >
              Continuer
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
