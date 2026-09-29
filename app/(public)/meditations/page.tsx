import type { Metadata } from "next";

import Link from "next/link";

import { BandeauPage } from "@/components/site/bandeau-page";
import { PaginationLiens } from "@/components/site/pagination-liens";
import { mediationServerAPI } from "@/features/mediation/apis/mediation.server";
import { CONTENEUR, dateCourte } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const PAR_PAGE = 10;
const DESCRIPTION =
  "Méditations et textes spirituels proposés par les prêtres de la paroisse Saint Sauveur Miséricordieux pour nourrir la prière.";

export const metadata: Metadata = {
  title: "Méditations",
  description: DESCRIPTION,
  alternates: { canonical: "/meditations" },
  openGraph: {
    title: "Méditations",
    description: DESCRIPTION,
    type: "website",
    locale: "fr_CI",
  },
};

type Props = { searchParams: Promise<{ page?: string }> };

/** Premières phrases d'une méditation, pour l'aperçu. */
const extrait = (t: string | null) => {
  const brut = (t ?? "").replace(/\s+/g, " ").trim();

  return brut.length > 220
    ? `${brut.slice(0, 220).replace(/\s\S*$/, "")}…`
    : brut;
};

export default async function PageMeditations({ searchParams }: Props) {
  const toutes = await mediationServerAPI.obtenirToutes();
  const pages = Math.max(1, Math.ceil(toutes.length / PAR_PAGE));
  const page = Math.min(
    pages,
    Math.max(1, Number.parseInt((await searchParams).page ?? "1", 10) || 1),
  );
  const visibles = toutes.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  return (
    <>
      <BandeauPage
        fil={[{ label: "Accueil", href: "/" }, { label: "Méditations" }]}
        sousTitre="Des textes pour prier et méditer, proposés par les prêtres de la paroisse."
        titre="Méditations"
      />
      <section
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-10 pb-16 pt-10 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-[60px]",
        )}
      >
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-8">
          {visibles.length === 0 ? (
            <p className="m-0 border-t border-ligne py-6 text-base text-gris">
              Aucune méditation n’est publiée pour le moment.
            </p>
          ) : (
            <ul className="m-0 flex list-none flex-col p-0">
              {visibles.map((m) => (
                <li key={m.id} className="border-t border-ligne last:border-b">
                  <Link
                    className="group flex flex-col gap-2 py-7 text-encre hover:text-encre hover:no-underline"
                    href={`/meditations/${m.id}`}
                  >
                    <span className="text-[13px] font-bold text-rouge">
                      {[m.category, dateCourte(m.date_at)]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                    <span className="break-words font-scripture text-[26px] leading-[1.2] text-marine group-hover:underline group-hover:underline-offset-4 lg:text-[32px]">
                      {m.title}
                    </span>
                    {extrait(m.content) && (
                      <span className="text-base leading-[1.6] text-encre-douce">
                        {extrait(m.content)}
                      </span>
                    )}
                    <span className="text-sm text-gris">{m.author}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <PaginationLiens chemin="/meditations" page={page} pages={pages} />
        </div>
        <aside className="flex flex-col gap-6 lg:col-span-3 lg:col-start-10">
          <div className="flex flex-col gap-3 border-t border-marine pt-[18px]">
            <span className="font-heading text-[17px] font-extrabold text-marine">
              La Parole du jour
            </span>
            <span className="text-[15px] leading-[1.5] text-gris">
              Les lectures de la messe et l’homélie de la paroisse, chaque jour.
            </span>
            <Link
              className="flex min-h-11 items-center text-[15px] font-bold text-rouge hover:text-rouge-hover"
              href="/parole-du-jour"
            >
              Lire les textes du jour
            </Link>
          </div>
          <div className="flex flex-col gap-3 border-t border-marine pt-[18px]">
            <span className="font-heading text-[17px] font-extrabold text-marine">
              Être accompagné
            </span>
            <span className="text-[15px] leading-[1.5] text-gris">
              Un prêtre peut vous recevoir pour un accompagnement spirituel.
            </span>
            <Link
              className="flex min-h-11 items-center text-[15px] font-bold text-rouge hover:text-rouge-hover"
              href="/equipe#rdv"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
