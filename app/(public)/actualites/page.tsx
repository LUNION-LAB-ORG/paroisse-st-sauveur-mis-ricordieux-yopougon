import type { Metadata } from "next";

import Link from "next/link";

import { EmplacementImage } from "@/components/accueil/emplacement-image";
import { BandeauPage } from "@/components/site/bandeau-page";
import { PaginationLiens } from "@/components/site/pagination-liens";
import { actualiteServerAPI } from "@/features/actualite/apis/actualite.server";
import { CONTENEUR, dateCourte } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const PAR_PAGE = 9;
const DESCRIPTION =
  "Les actualités de la paroisse Saint Sauveur Miséricordieux : vie de la communauté, célébrations, rencontres et projets.";

export const metadata: Metadata = {
  title: "Actualités",
  description: DESCRIPTION,
  alternates: { canonical: "/actualites" },
  openGraph: {
    title: "Actualités de la paroisse",
    description: DESCRIPTION,
    type: "website",
    locale: "fr_CI",
  },
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function PageActualites({ searchParams }: Props) {
  const toutes = await actualiteServerAPI.obtenirToutes();
  const pages = Math.max(1, Math.ceil(toutes.length / PAR_PAGE));
  const page = Math.min(
    pages,
    Math.max(1, Number.parseInt((await searchParams).page ?? "1", 10) || 1),
  );
  const visibles = toutes.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  return (
    <>
      <BandeauPage
        fil={[{ label: "Accueil", href: "/" }, { label: "Actualités" }]}
        sousTitre="La vie de la paroisse au fil des semaines."
        titre="Actualités"
      />
      <section
        className={cn(
          CONTENEUR,
          "flex flex-col gap-10 pb-16 pt-10 lg:pb-20 lg:pt-[60px]",
        )}
      >
        {visibles.length === 0 ? (
          <div className="flex flex-col gap-3 border-t border-ligne py-6">
            <p className="m-0 text-base text-gris">
              Aucune actualité n’est publiée pour le moment.
            </p>
            <Link
              className="flex min-h-11 items-center self-start text-[15px] font-bold text-rouge hover:text-rouge-hover"
              href="/communaute"
            >
              Voir les publications de la communauté
            </Link>
          </div>
        ) : (
          <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-10 p-0 md:grid-cols-2 lg:grid-cols-3">
            {visibles.map((a) => (
              <li key={a.id} className="min-w-0">
                <Link
                  className="group flex h-full flex-col gap-3.5 text-encre hover:text-encre hover:no-underline"
                  href={`/actualites/${a.id}`}
                >
                  <EmplacementImage
                    alt=""
                    className="h-[220px] w-full lg:h-[250px]"
                    libelle="Photo de l’actualité"
                    src={a.image}
                  />
                  <span className="text-[13px] font-bold text-rouge">
                    {a.category}
                    {(a.published_at ?? a.created_at) && (
                      <span className="font-normal text-gris">
                        {" "}
                        · {dateCourte(a.published_at ?? a.created_at)}
                      </span>
                    )}
                  </span>
                  <span className="break-words font-heading text-xl font-semibold leading-[1.2] text-marine group-hover:underline group-hover:underline-offset-4 lg:text-[24px]">
                    {a.title}
                  </span>
                  {a.new_resume && (
                    <span className="line-clamp-3 text-[15px] leading-[1.55] text-encre-douce">
                      {a.new_resume}
                    </span>
                  )}
                  <span className="mt-auto text-[15px] font-bold text-rouge">
                    Lire l’actualité
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <PaginationLiens chemin="/actualites" page={page} pages={pages} />
      </section>
    </>
  );
}
