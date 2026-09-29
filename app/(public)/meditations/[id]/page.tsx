import type { Metadata } from "next";

import { Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DonneesStructurees } from "@/components/site/donnees-structurees";
import { FilAriane } from "@/components/site/fil-ariane";
import { mediationServerAPI } from "@/features/mediation/apis/mediation.server";
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

const resume = (t: string | null) => {
  const brut = (t ?? "").replace(/\s+/g, " ").trim();

  return brut ? brut.slice(0, 160) : undefined;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = await mediationServerAPI.obtenir((await params).id);

  if (!m) return { title: "Méditation introuvable" };

  return {
    title: `${m.title} — Méditation`,
    description: resume(m.content),
    alternates: { canonical: `/meditations/${m.id}` },
    openGraph: {
      title: m.title,
      description: resume(m.content),
      images: m.image ? [m.image] : undefined,
      type: "article",
      locale: "fr_CI",
    },
  };
}

export default async function PageMeditation({ params }: Props) {
  const { id } = await params;
  const [m, toutes] = await Promise.all([
    mediationServerAPI.obtenir(id),
    mediationServerAPI.obtenirToutes(),
  ]);

  if (!m) notFound();

  const url = `${URL_SITE}/meditations/${m.id}`;
  const texte = enParagraphes(m.content);
  const autres = toutes.filter((x) => x.id !== m.id).slice(0, 3);

  return (
    <>
      <DonneesStructurees
        donnees={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: m.title,
          description: resume(m.content),
          datePublished: m.date_at,
          image: m.image ? [m.image] : undefined,
          author: { "@type": "Person", name: m.author },
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
              { label: "Méditations", href: "/meditations" },
              { label: m.title },
            ]}
          />
          <span className="text-sm font-bold text-rouge">
            {[m.category, dateCourte(m.date_at)].filter(Boolean).join(" · ")}
          </span>
          <h1 className="m-0 break-words font-scripture text-[34px] font-normal leading-[1.15] text-marine lg:text-[52px]">
            {m.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-ligne py-3.5">
            <span className="text-[15px] font-bold">{m.author}</span>
            <a
              className="flex min-h-11 items-center gap-2 rounded-charte border border-ligne bg-white px-4 text-[15px] font-semibold text-encre hover:text-encre hover:no-underline"
              href={lienPartageWhatsapp(`${m.title}\n${url}`)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Share2 aria-hidden className="size-4 text-marine" />
              Partager sur WhatsApp
            </a>
          </div>
        </div>

        {m.image && (
          <div
            className={cn(
              CONTENEUR,
              "mt-[30px] max-w-[1120px] min-[1120px]:px-[120px]",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={m.title}
              className="max-h-[520px] w-full object-cover"
              src={m.image}
            />
          </div>
        )}

        <div className="mt-11 flex w-full max-w-[752px] flex-col gap-[22px] px-4 font-scripture text-[20px] leading-[1.7] text-[#2C2C36] lg:text-[22px]">
          {texte.length > 0 ? (
            texte.map((p, i) => (
              <p key={i} className="m-0 whitespace-pre-line break-words">
                {p}
              </p>
            ))
          ) : (
            <p className="m-0 font-body text-base text-gris">
              Le texte complet de cette méditation sera bientôt disponible.
            </p>
          )}
          <Link
            className="mt-4 flex min-h-11 items-center self-start font-body text-[15px] font-bold text-rouge hover:text-rouge-hover"
            href="/meditations"
          >
            Toutes les méditations
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
              Autres méditations
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {autres.map((x) => (
                <Link
                  key={x.id}
                  className="flex flex-col gap-2.5 border-t border-marine pt-4 text-encre hover:text-encre hover:no-underline"
                  href={`/meditations/${x.id}`}
                >
                  <span className="text-[13px] font-bold text-rouge">
                    {dateCourte(x.date_at)}
                  </span>
                  <span className="break-words font-scripture text-[22px] leading-[1.25] text-marine">
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
