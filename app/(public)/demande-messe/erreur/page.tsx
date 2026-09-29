import type { Metadata } from "next";

import Link from "next/link";

import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Paiement non abouti",
  robots: { index: false },
};

export default function Page() {
  return (
    <section
      className={cn(
        CONTENEUR,
        "flex flex-col items-start gap-5 py-16 lg:py-24",
      )}
    >
      <span className="text-sm font-bold text-rouge">Demande de messe</span>
      <h1 className="m-0 font-heading text-[30px] font-extrabold text-marine lg:text-[40px]">
        Paiement non abouti
      </h1>
      <p className="m-0 max-w-[640px] text-base leading-[1.6] text-encre-douce lg:text-[17px]">
        Le paiement de votre offrande n’a pas pu être validé : solde
        insuffisant, annulation ou incident technique. Votre demande n’est pas
        confirmée. Vous pouvez réessayer, ou choisir de régler au secrétariat.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          className="rounded-charte bg-rouge px-[26px] py-4 text-center text-base font-bold text-white hover:bg-rouge-hover hover:text-white hover:no-underline"
          href="/demande-messe"
        >
          Réessayer la demande
        </Link>
        <Link
          className="rounded-charte border border-marine px-[26px] py-[15px] text-center text-base font-bold text-marine hover:text-marine hover:no-underline"
          href="/"
        >
          Retour à l’accueil
        </Link>
      </div>
    </section>
  );
}
