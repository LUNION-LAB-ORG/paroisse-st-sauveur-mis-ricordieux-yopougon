import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionsPublication } from "@/components/communaute/actions-publication";
import { Commentaires } from "@/components/communaute/commentaires";
import { LecteurVideo } from "@/components/communaute/lecteur-video";
import { FilAriane } from "@/components/site/fil-ariane";
import { publicationServerAPI } from "@/features/publication/apis/publication.server";
import {
  concerneLeChantier,
  formatDatePublication,
  paragraphes,
} from "@/features/publication/utils/publication.utils";
import { CONTENEUR, LOGO_PAR_DEFAUT } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const URL_SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://paroisse-st-sauveur-mis-ricordieux.vercel.app";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await publicationServerAPI.obtenir((await params).slug);

  if (!p) return { title: "Publication introuvable" };
  const image =
    p.cover ??
    p.gallery[0] ??
    (p.youtube_id
      ? `https://i.ytimg.com/vi/${p.youtube_id}/hqdefault.jpg`
      : undefined);

  return {
    title: p.title,
    description: p.lead ?? undefined,
    openGraph: {
      title: p.title,
      description: p.lead ?? undefined,
      images: image ? [image] : undefined,
      type: "article",
    },
  };
}

export default async function PagePublication({ params }: Props) {
  const { slug } = await params;
  const p = await publicationServerAPI.obtenir(slug);

  if (!p) notFound();

  const [commentaires, suggestions] = await Promise.all([
    publicationServerAPI.obtenirCommentaires(p.id),
    publicationServerAPI.obtenirPage({ per_page: 3, exclude: p.slug }),
  ]);

  const url = `${URL_SITE}/communaute/${p.slug}`;
  const blocs = paragraphes(p.body);
  // La citation s'insère après le deuxième paragraphe, comme sur la maquette
  const avant = blocs.slice(0, 2);
  const apres = blocs.slice(2);
  const photos =
    p.type === "video" ? p.gallery : p.gallery.slice(p.cover ? 0 : 1);

  return (
    <>
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
              { label: "Communauté", href: "/communaute" },
              { label: p.category ?? p.format },
            ]}
          />
          <span className="text-sm font-bold text-rouge">
            {[p.format, p.category].filter(Boolean).join(" · ")}
          </span>
          <h1 className="m-0 font-heading text-[30px] font-extrabold leading-[1.12] tracking-[-0.015em] text-marine lg:text-[44px]">
            {p.title}
          </h1>
          {p.lead && (
            <p className="m-0 text-lg leading-[1.55] text-encre-douce lg:text-[21px]">
              {p.lead}
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
                <span className="text-[15px] font-bold">{p.author_label}</span>
                <span className="text-sm text-gris">
                  Publié le {formatDatePublication(p.published_at)} ·{" "}
                  {p.reading_minutes} min de lecture
                </span>
              </div>
            </div>
            <ActionsPublication
              commentaires={p.comments_count}
              id={p.id}
              likes={p.likes_count}
              titre={p.title}
              url={url}
            />
          </div>
        </div>

        {p.type === "video" && p.youtube_id ? (
          <div className={cn(CONTENEUR, "mt-[30px] flex flex-col gap-2.5")}>
            <LecteurVideo
              cover={p.cover}
              duree={p.video_duration}
              titre={p.title}
              youtubeId={p.youtube_id}
            />
            <span className="text-sm text-gris">
              Vidéo hébergée sur la chaîne YouTube de la paroisse.
            </span>
          </div>
        ) : p.type === "video" ? (
          <div className={cn(CONTENEUR, "mt-[30px]")}>
            <div className="flex aspect-video w-full items-center justify-center bg-[#14173F] text-sm text-lavande">
              [Vidéo YouTube — lien à saisir dans le back-office]
            </div>
          </div>
        ) : p.cover || (p.type === "photo" && p.gallery[0]) ? (
          <div className={cn(CONTENEUR, "mt-[30px]")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={p.title}
              className="max-h-[675px] w-full object-cover"
              src={p.cover ?? p.gallery[0]}
            />
          </div>
        ) : null}

        <div className="mt-11 flex w-full max-w-[752px] flex-col gap-[22px] px-4 text-[17px] leading-[1.75] text-[#2C2C36] lg:text-[19px]">
          {avant.map((t, i) => (
            <p key={`a${i}`} className="m-0 whitespace-pre-line">
              {t}
            </p>
          ))}
          {p.quote && (
            <blockquote className="my-2.5 border-l-[3px] border-rouge py-1.5 pl-7 font-scripture text-2xl leading-[1.4] text-marine lg:text-[28px]">
              {p.quote}
            </blockquote>
          )}
          {apres.map((t, i) => (
            <p key={`b${i}`} className="m-0 whitespace-pre-line">
              {t}
            </p>
          ))}
          {photos.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {photos.map((src, i) => (
                <a
                  key={src}
                  href={src}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`${p.title}, vue ${i + 1}`}
                    className="block h-[150px] w-full object-cover"
                    loading="lazy"
                    src={src}
                  />
                </a>
              ))}
            </div>
          )}
          {concerneLeChantier(p) && (
            <Link
              className="mt-2.5 self-start rounded-charte bg-rouge px-[26px] py-4 text-base font-bold leading-[1.2] text-white hover:bg-rouge-hover hover:text-white hover:no-underline"
              href="/nouvelle-eglise"
            >
              Soutenir la construction
            </Link>
          )}
        </div>

        <div className="mt-14 w-full max-w-[752px] px-4 lg:mt-[60px]">
          <Commentaires initiaux={commentaires} publicationId={p.id} />
        </div>
      </article>

      {suggestions.data.length > 0 && (
        <section className="mt-16 border-t border-ligne bg-white lg:mt-[70px]">
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
              {suggestions.data.map((s) => (
                <Link
                  key={s.id}
                  className="flex flex-col gap-2.5 border-t border-marine pt-4 text-encre hover:text-encre hover:no-underline"
                  href={`/communaute/${s.slug}`}
                >
                  <span className="text-[13px] font-bold text-rouge">
                    {[s.format, s.category].filter(Boolean).join(" · ")}
                  </span>
                  <span className="font-heading text-lg font-bold leading-[1.3] text-marine lg:text-[19px]">
                    {s.title}
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
