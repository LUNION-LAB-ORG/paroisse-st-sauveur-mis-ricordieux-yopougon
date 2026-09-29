"use client";

import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Bulle, Coeur } from "./icones";

import { publicationAPI } from "@/features/publication/apis/publication.api";
import { identifiantAppareil } from "@/lib/appareil";
import { lienPartageWhatsapp } from "@/lib/charte";
import { cn } from "@/lib/utils";

interface Props {
  id: number;
  titre: string;
  url: string;
  likes: number;
  commentaires: number;
}

const BOUTON =
  "flex min-h-11 items-center gap-2 rounded-charte border px-4 py-2.5 text-[15px] font-bold";

/** J'aime (1 par appareil, sans compte), lien vers les commentaires, partage. */
export function ActionsPublication({
  id,
  titre,
  url,
  likes,
  commentaires,
}: Props) {
  const [aime, setAime] = useState(false);
  const [compte, setCompte] = useState(likes);
  const [partage, setPartage] = useState(false);
  const [copie, setCopie] = useState(false);

  useEffect(() => {
    publicationAPI
      .etatJaime(id, identifiantAppareil())
      .then((r) => {
        setAime(r.data.liked);
        setCompte(r.data.likes_count);
      })
      .catch(() => {});
  }, [id]);

  const aimer = async () => {
    // Mise à jour optimiste, corrigée par la réponse du serveur
    setAime((v) => !v);
    setCompte((c) => c + (aime ? -1 : 1));
    try {
      const r = await publicationAPI.basculerJaime(id, identifiantAppareil());

      setAime(r.data.liked);
      setCompte(r.data.likes_count);
    } catch {
      setAime(aime);
      setCompte(compte);
    }
  };

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          aria-label={aime ? "Je n’aime plus" : "J’aime"}
          aria-pressed={aime}
          className={cn(
            BOUTON,
            aime
              ? "border-rouge bg-[#FBEAED] text-rouge"
              : "border-ligne bg-white text-encre",
          )}
          type="button"
          onClick={aimer}
        >
          <Coeur plein={aime} />
          {compte}
        </button>
        <a
          aria-label={`${commentaires} commentaires`}
          className={cn(
            BOUTON,
            "border-ligne bg-white text-encre hover:text-encre hover:no-underline",
          )}
          href="#commentaires"
        >
          <Bulle couleur="#2B337E" />
          {commentaires}
        </a>
        <button
          aria-expanded={partage}
          className={cn(BOUTON, "border-ligne bg-white text-encre")}
          type="button"
          onClick={() => {
            setPartage((v) => !v);
            setCopie(false);
          }}
        >
          <Share2
            aria-hidden
            className="size-[18px] text-marine"
            strokeWidth={2}
          />
          <span className="hidden sm:inline">Partager</span>
        </button>
      </div>
      {partage && (
        <div className="flex basis-full flex-wrap justify-end gap-2.5">
          <a
            className="flex min-h-11 items-center rounded-charte bg-[#1F8A4C] px-4 py-[11px] text-sm font-bold text-white hover:text-white hover:no-underline"
            href={lienPartageWhatsapp(`${titre}\n${url}`)}
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp
          </a>
          <a
            className="flex min-h-11 items-center rounded-charte bg-[#2B4E9E] px-4 py-[11px] text-sm font-bold text-white hover:text-white hover:no-underline"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Facebook
          </a>
          <button
            className="min-h-11 rounded-charte border border-marine bg-white px-4 py-[11px] text-sm font-bold text-marine"
            type="button"
            onClick={copier}
          >
            {copie ? "Lien copié" : "Copier le lien"}
          </button>
        </div>
      )}
    </>
  );
}
