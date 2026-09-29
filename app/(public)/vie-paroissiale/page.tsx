import type { Metadata } from "next";

import Link from "next/link";

import { ListeMouvements } from "@/components/mouvements/liste-mouvements";
import { BandeauPage } from "@/components/site/bandeau-page";
import { DonneesStructurees } from "@/components/site/donnees-structurees";
import { serviceServerAPI } from "@/features/service/apis/service.server";
import { CONTENEUR, URL_SITE } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const DESCRIPTION =
  "Chorale, servants de messe, groupes de prière, jeunesse, charité, familles : les mouvements et groupes de la paroisse Saint Sauveur Miséricordieux vous accueillent.";

export const metadata: Metadata = {
  title: "Mouvements et groupes",
  description: DESCRIPTION,
  alternates: { canonical: "/vie-paroissiale" },
  openGraph: {
    title: "Mouvements et groupes — Vie paroissiale",
    description: DESCRIPTION,
    type: "website",
    locale: "fr_CI",
  },
};

export default async function PageVieParoissiale() {
  const mouvements = await serviceServerAPI.obtenirMouvements();

  return (
    <>
      <DonneesStructurees
        donnees={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Mouvements et groupes de la paroisse",
          itemListElement: mouvements.map((m, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: m.title,
            url: `${URL_SITE}/vie-paroissiale/${m.id}`,
          })),
        }}
      />
      <BandeauPage
        fil={[{ label: "Accueil", href: "/" }, { label: "Vie paroissiale" }]}
        sousTitre="Prier, chanter, servir, se former, partager : chacun peut trouver sa place dans la communauté. Choisissez un groupe et contactez son responsable."
        titre="Mouvements et groupes"
      />

      <section className={cn(CONTENEUR, "pb-16 pt-10 lg:pb-20 lg:pt-[60px]")}>
        {mouvements.length === 0 ? (
          <p className="m-0 border-t border-ligne py-6 text-base text-gris">
            Les mouvements et groupes seront bientôt présentés ici. Le
            secrétariat paroissial vous renseigne en attendant.
          </p>
        ) : (
          <ListeMouvements mouvements={mouvements} />
        )}
      </section>

      <section className="border-t border-ligne bg-white">
        <div
          className={cn(
            CONTENEUR,
            "grid grid-cols-1 gap-6 py-12 lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:py-[70px]",
          )}
        >
          <div className="flex flex-col gap-3 lg:col-span-7">
            <span className="text-sm font-bold text-rouge">
              Vous ne trouvez pas votre groupe ?
            </span>
            <h2 className="m-0 font-heading text-[26px] font-extrabold leading-[1.15] text-marine lg:text-[34px]">
              Le secrétariat vous oriente
            </h2>
            <p className="m-0 text-base leading-[1.6] text-gris lg:text-[17px]">
              Sacrements, catéchèse, projet de nouveau groupe : écrivez-nous ou
              passez au secrétariat paroissial.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <Link
              className="rounded-charte bg-marine px-6 py-[15px] text-center text-[15px] font-bold text-white hover:bg-marine-deep hover:text-white hover:no-underline"
              href="/contact"
            >
              Contacter la paroisse
            </Link>
            <Link
              className="rounded-charte border border-marine px-6 py-3.5 text-center text-[15px] font-bold text-marine hover:text-marine hover:no-underline"
              href="/agenda"
            >
              Voir l’agenda
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
