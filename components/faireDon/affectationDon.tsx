import Link from "next/link";
import { Button } from "@heroui/button";

import SelectDon from "./selectDon";

export default function AffectationDon() {
  return (
    <div className="text-stone-700">
      <h2 className="text-blue-900 text-xl font-semibold sm:text-2xl lg:text-4xl mb-6 lg:mb-10">
        Affectation du don
      </h2>
      <SelectDon />

      <p className="lg:text-2xl mb-6 lg:mb-10">{`Projet de restauration du clocher de notre église historique.`}</p>
      <div className="full flex justify-center">
        <Link className="w-fit" href="/faire-don/paiement">
          <Button
            className=" text-md lg:text-xl py-4 lg:py-8 lg:px-44"
            color="primary"
          >
            Continuer
          </Button>
        </Link>
      </div>
    </div>
  );
}
