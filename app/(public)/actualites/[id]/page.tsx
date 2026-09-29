import type { Metadata } from "next";

import { Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DonneesStructurees } from "@/components/site/donnees-structurees";
import { FilAriane } from "@/components/site/fil-ariane";
import { actualiteServerAPI } from "@/features/actualite/apis/actualite.server";
import {
  CONTENEUR,
  dateCourte,
  enParagraphes,
  lienPartageWhatsapp,
  LOGO_PAR_DEFAUT,
  URL_SITE,
} from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await actualiteServerAPI.obtenir((await params).id);

  if (!a) return { title: "Actualité introuvable" };

  return {
    title: a.title,
    description: a.new_resume ?? undefined,
    alternates: { canonical: `/actualites/${a.id}` },
    openGraph: {
      title: a.title,
      description: a.new_resume ?? undefined,
      images: a.image ? [a.image] : undefined,
      type: "article",
      locale: "fr_CI",
    },
  };
}

export default async function PageActualite({ params }: Props) {
  const { id } = await params;
  const [a, toutes] = await Promise.all([
    actualiteServerAPI.obtenir(id),
    actualiteServerAPI.obtenirToutes(),
  ]);

  if (!a) notFound();

  const url = `${URL_SITE}/actualites/${a.id}`;
  const date = a.published_at ?? a.created_at;
  const texte = enParagraphes(a.content);
  const autres = toutes.filter((x) => x.id !== a.id).slice(0, 3);

  return (
    <>
      <DonneesStructurees
        donnees={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: a.title,
          description: a.new_resume ?? undefined,
          datePublished: date,
          image: a.image ? [a.image] : undefined,
          author: { "@type": "Person", name: a.author },
          publisher: {
            "@type": "Organization",
            name: "Paroisse Saint Sauveur Miséricordieux",
            logo: `${URL_SITE}${LOGO_PAR_DEFAUT}`,
          },
          mainEntityOfPage: url,
        }}
      />
      <article className="flex flex-col items-center pt-8 lg:pt-11">
        <div
          className={cn(
            CONTENEUR,
            "flex max-w-[1120px] flex-col gap-5 min-[1120px]:px-[120px]",
          )}
        >
          <FilAriane
            etapes={[
              { label: "Accueil", href: "/" },
              { label: "Actualités", href: "/actualites" },
              { label: a.title },
            ]}
          />
          <span className="text-sm font-bold text-rouge">
            {[a.category, a.location].filter(Boolean).join(" · ")}
          </span>
          <h1 className="m-0 break-words font-heading text-[30px] font-extrabold leading-[1.12] tracking-[-0.015em] text-marine lg:text-[44px]">
            {a.title}
          </h1>
          {a.new_resume && (
            <p className="m-0 text-lg leading-[1.55] text-encre-douce lg:text-[21px]">
              {a.new_resume}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-ligne py-3.5">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                aria-hidden
                alt=""
                className="size-11 rounded-full object-cover"
                src={LOGO_PAR_DEFAUT}
              />
              <div className="flex flex-col">
                <span className="text-[15px] font-bold">{a.author}</span>
                {date && (
                  <span className="text-sm text-gris">
                    Publié le {dateCourte(date)}
                  </span>
                )}
              </div>
            </div>
            <a
              className="flex min-h-11 items-center gap-2 rounded-charte border border-ligne bg-white px-4 text-[15px] font-semibold text-encre hover:text-encre hover:no-underline"
              href={lienPartageWhatsapp(`${a.title}\n${url}`)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Share2 aria-hidden className="size-4 text-marine" />
              Partager
            </a>
          </div>
        </div>

        {a.image && (
          <div
            className={cn(
              CONTENEUR,
              "mt-[30px] max-w-[1120px] min-[1120px]:px-[120px]",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={a.title}
              className="max-h-[560px] w-full object-cover"
              src={a.image}
            />
          </div>
        )}

        <div className="mt-11 flex w-full max-w-[752px] flex-col gap-[22px] px-4 text-[17px] leading-[1.75] text-[#2C2C36] lg:text-[19px]">
          {texte.length > 0 ? (
            texte.map((p, i) => (
              <p key={i} className="m-0 whitespace-pre-line break-words">
                {p}
              </p>
            ))
          ) : (
            <p className="m-0 text-gris">
              Le texte complet de cette actualité sera bientôt disponible.
            </p>
          )}
          <Link
            className="mt-4 flex min-h-11 items-center self-start text-[15px] font-bold text-rouge hover:text-rouge-hover"
            href="/actualites"
          >
            Toutes les actualités
          </Link>
        </div>
      </article>

      {autres.length > 0 && (
        <section className="mt-14 border-t border-ligne bg-white lg:mt-[70px]">
          <div
            className={cn(
              CONTENEUR,
              "flex flex-col gap-[26px] py-12 lg:py-[60px]",
            )}
          >
            <h2 className="m-0 font-heading text-2xl font-extrabold text-marine lg:text-[26px]">
              À lire aussi
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {autres.map((x) => (
                <Link
                  key={x.id}
                  className="flex flex-col gap-2.5 border-t border-marine pt-4 text-encre hover:text-encre hover:no-underline"
                  href={`/actualites/${x.id}`}
                >
                  <span className="text-[13px] font-bold text-rouge">
                    {x.category}
                  </span>
                  <span className="break-words font-heading text-lg font-bold leading-[1.3] text-marine lg:text-[19px]">
                    {x.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
