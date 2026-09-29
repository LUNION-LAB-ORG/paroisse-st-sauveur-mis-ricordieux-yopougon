"use client";

import { useState } from "react";

import { Lecture } from "./icones";

/**
 * Vidéo YouTube de la paroisse, en mode youtube-nocookie : le lecteur (et ses
 * cookies) n'est chargé qu'au clic.
 */
export function LecteurVideo({
  youtubeId,
  titre,
  cover,
  duree,
}: {
  youtubeId: string;
  titre: string;
  cover: string | null;
  duree: string | null;
}) {
  const [lance, setLance] = useState(false);
  const miniature =
    cover ?? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div className="relative aspect-video w-full bg-[#14173F]">
      {lance ? (
        <iframe
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          className="absolute inset-0 size-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={titre}
        />
      ) : (
        <button
          aria-label={`Lire la vidéo : ${titre}`}
          className="absolute inset-0 flex items-center justify-center"
          type="button"
          onClick={() => setLance(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="absolute inset-0 size-full object-cover opacity-50"
            src={miniature}
          />
          <span className="relative flex size-16 items-center justify-center rounded-full bg-white lg:size-24">
            <Lecture className="size-6 lg:size-9" />
          </span>
          <span className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-[rgba(10,12,40,.6)] px-6 py-[18px] text-sm text-white">
            <span>0:00</span>
            <span className="h-1 grow bg-white/30" />
            <span>{duree ?? ""}</span>
          </span>
        </button>
      )}
    </div>
  );
}
