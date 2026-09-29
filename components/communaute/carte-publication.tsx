import type { IPublication } from "@/features/publication/types/publication.type";

import Link from "next/link";

import { Bulle, Coeur, Guillemets, Lecture, Photos } from "./icones";

import {
  formatDatePublication,
  libelleMedia,
} from "@/features/publication/utils/publication.utils";
import { cn } from "@/lib/utils";

/** Visuel de la carte selon le type : album photo, vidéo, texte (citation). */
export function MediaPublication({
  p,
  grand = false,
}: {
  p: IPublication;
  grand?: boolean;
}) {
  const hauteur = grand
    ? "h-[240px] lg:h-full lg:min-h-[430px]"
    : "h-[220px] lg:h-[250px]";

  if (p.type === "text") {
    return (
      <div
        className={cn(
          "flex flex-col justify-between bg-marine p-[30px] text-white",
          hauteur,
        )}
      >
        <Guillemets />
        <span className="font-scripture text-[22px] leading-[1.3] lg:text-[25px]">
          {p.quote ?? p.lead}
        </span>
      </div>
    );
  }

  if (p.type === "video") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-marine-deep",
          hauteur,
        )}
      >
        {p.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            className="absolute inset-0 size-full object-cover opacity-55"
            loading="lazy"
            src={p.cover}
          />
        )}
        <span
          className={cn(
            "relative flex items-center justify-center rounded-full bg-white",
            grand ? "size-[84px]" : "size-16",
          )}
        >
          <Lecture className={grand ? "size-[30px]" : "size-6"} />
        </span>
        <span className="absolute bottom-3.5 left-3.5 bg-[rgba(20,22,60,.85)] px-2.5 py-1.5 text-[13px] font-bold text-white lg:bottom-5 lg:left-5">
          {libelleMedia(p)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center bg-lin text-sm text-gris-clair",
        hauteur,
      )}
    >
      {p.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          className="absolute inset-0 size-full object-cover"
          loading="lazy"
          src={p.cover}
        />
      ) : (
        "[Photo]"
      )}
      <span className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 bg-[rgba(20,22,60,.85)] px-2.5 py-1.5 text-[13px] font-bold text-white">
        <Photos />
        {libelleMedia(p)}
      </span>
    </div>
  );
}

export function CartePublication({ p }: { p: IPublication }) {
  return (
    <Link
      className="group flex flex-col gap-3.5 text-encre hover:text-encre hover:no-underline"
      href={`/communaute/${p.slug}`}
    >
      <MediaPublication p={p} />
      <span className="text-[13px] font-bold text-rouge">
        {[p.format, p.category].filter(Boolean).join(" · ")} ·{" "}
        <span className="font-normal text-gris">
          {formatDatePublication(p.published_at)}
        </span>
      </span>
      <span className="font-heading text-xl font-bold leading-[1.25] text-marine group-hover:underline group-hover:underline-offset-4 lg:text-[21px]">
        {p.title}
      </span>
      {p.lead && (
        <span className="line-clamp-3 text-[15px] leading-[1.55] text-encre-douce">
          {p.lead}
        </span>
      )}
      <span className="mt-auto flex items-center gap-5 border-t border-ligne pt-3 text-sm text-gris">
        <span className="flex items-center gap-1.5">
          <Coeur className="size-4" />
          <span className="sr-only">J’aime :</span>
          {p.likes_count}
        </span>
        <span className="flex items-center gap-1.5">
          <Bulle className="size-4" />
          <span className="sr-only">Commentaires :</span>
          {p.comments_count}
        </span>
        <span className="ml-auto font-bold text-rouge">Lire</span>
      </span>
    </Link>
  );
}

export function PublicationALaUne({ p }: { p: IPublication }) {
  return (
    <Link
      className="group grid grid-cols-1 border border-ligne bg-white text-encre hover:text-encre hover:no-underline lg:grid-cols-[minmax(0,760fr)_minmax(0,440fr)]"
      href={`/communaute/${p.slug}`}
    >
      <MediaPublication grand p={p} />
      <div className="flex flex-col gap-4 p-6 lg:p-10">
        <span className="text-[13px] font-bold text-rouge">
          {["À la une", p.category, formatDatePublication(p.published_at)]
            .filter(Boolean)
            .join(" · ")}
        </span>
        <span className="font-heading text-2xl font-extrabold leading-[1.15] text-marine group-hover:underline group-hover:underline-offset-4 lg:text-[30px]">
          {p.title}
        </span>
        {p.lead && (
          <span className="text-base leading-[1.6] text-encre-douce lg:text-[17px]">
            {p.lead}
          </span>
        )}
        <span className="mt-auto flex gap-[22px] text-[15px] text-gris">
          <span className="flex items-center gap-1.5">
            <Coeur />
            {p.likes_count}
          </span>
          <span className="flex items-center gap-1.5">
            <Bulle />
            {p.comments_count} commentaire{p.comments_count > 1 ? "s" : ""}
          </span>
        </span>
      </div>
    </Link>
  );
}
