import Link from "next/link";
import { Button } from "@heroui/react";
import SelectDon from "./selectDon";

export default function AffectationDon() {
  return (
    <section className="w-full">
      <div className="text-center mb-6">
        <p className="text-[#98141f] text-sm font-semibold uppercase tracking-widest mb-2">
          Destination
        </p>
        <h2 className="text-[#2d2d83] text-2xl sm:text-3xl font-bold mb-2">
          Affectation du don
        </h2>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          Choisissez le projet que vous souhaitez soutenir.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <SelectDon />

        <Button
          variant="primary"
          className="w-full bg-[#98141f] rounded-xl py-3 text-base"
          asChild
        >
          <Link href="/faire-don/paiement">Continuer</Link>
        </Button>
      </div>
    </section>
  );
}
