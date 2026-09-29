"use client";

import type { ICommentaire } from "@/features/publication/types/publication.type";

import { Button } from "@heroui/react";
import { useState } from "react";

import { ChampTexte, ChampZone } from "@/components/site/champs";
import { MentionDonnees } from "@/components/site/mention-donnees";
import { publicationAPI } from "@/features/publication/apis/publication.api";
import { ilYa } from "@/features/publication/utils/publication.utils";
import { identifiantAppareil } from "@/lib/appareil";

interface CommentaireAffiche extends ICommentaire {
  enAttente?: boolean;
  aime?: boolean;
}

/** Formulaire (publication après validation) + commentaires publiés avec J'aime. */
export function Commentaires({
  publicationId,
  initiaux,
}: {
  publicationId: number;
  initiaux: ICommentaire[];
}) {
  const [liste, setListe] = useState<CommentaireAffiche[]>(initiaux);
  const [nom, setNom] = useState("");
  const [texte, setTexte] = useState("");
  const [erreurs, setErreurs] = useState<{
    nom?: string;
    texte?: string;
    general?: string;
  }>({});
  const [envoi, setEnvoi] = useState(false);

  const publier = async () => {
    const e: typeof erreurs = {};

    if (!nom.trim()) e.nom = "Indiquez votre prénom.";
    if (texte.trim().length < 2) e.texte = "Écrivez votre commentaire.";
    setErreurs(e);
    if (Object.keys(e).length) return;

    setEnvoi(true);
    try {
      const r = await publicationAPI.commenter(publicationId, {
        author: nom.trim(),
        content: texte.trim(),
      });

      setListe((l) => [{ ...r.data, enAttente: true }, ...l]);
      setTexte("");
    } catch (err) {
      setErreurs({
        general:
          err instanceof Error
            ? err.message
            : "Le commentaire n’a pas pu être envoyé.",
      });
    } finally {
      setEnvoi(false);
    }
  };

  const aimer = async (c: CommentaireAffiche) => {
    if (c.enAttente) return;
    try {
      const r = await publicationAPI.aimerCommentaire(
        c.id,
        identifiantAppareil(),
      );

      setListe((l) =>
        l.map((x) =>
          x.id === c.id
            ? { ...x, aime: r.data.liked, likes_count: r.data.likes_count }
            : x,
        ),
      );
    } catch {
      /* ignoré */
    }
  };

  const publies = liste.filter((c) => !c.enAttente).length;

  return (
    <section
      className="flex scroll-mt-4 flex-col gap-[22px] border-t border-marine pt-[30px]"
      id="commentaires"
    >
      <h2 className="m-0 font-heading text-2xl font-extrabold text-marine">
        Commentaires ({publies})
      </h2>

      <div className="flex flex-col gap-3 border border-ligne bg-white p-[22px]">
        <ChampTexte
          autoComplete="given-name"
          erreur={erreurs.nom}
          label="Votre prénom"
          maxLength={80}
          value={nom}
          onChange={setNom}
        />
        <ChampZone
          erreur={erreurs.texte}
          label="Votre commentaire"
          maxLength={1000}
          value={texte}
          onChange={setTexte}
        />
        {erreurs.general && (
          <p className="m-0 text-sm text-rouge">{erreurs.general}</p>
        )}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <span className="text-[13px] text-gris">
            Les commentaires sont publiés après validation par la paroisse.
          </span>
          <Button
            className="h-auto min-h-11 rounded-charte bg-marine px-6 py-[13px] text-[15px] font-bold text-white hover:bg-marine-deep"
            isPending={envoi}
            onPress={publier}
          >
            Publier
          </Button>
        </div>
        <MentionDonnees finalite="servent uniquement à publier votre commentaire après modération ; seul votre prénom est affiché" />
      </div>

      <ul className="m-0 flex list-none flex-col gap-5 p-0">
        {liste.map((c) => (
          <li
            key={c.id}
            className="grid grid-cols-[48px_minmax(0,1fr)] gap-3.5 border-b border-ligne pb-5"
          >
            <span
              aria-hidden
              className="flex size-11 items-center justify-center rounded-full bg-[#E3E6F3] font-bold text-marine"
            >
              {c.initial || c.author.charAt(0).toUpperCase()}
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="text-base font-bold">{c.author}</span>
                <span className="text-[13px] text-gris">
                  {ilYa(c.created_at)}
                </span>
                {c.enAttente && (
                  <span className="bg-[#FFF4DB] px-2 py-[3px] text-xs font-bold text-[#8A6212]">
                    En attente de validation
                  </span>
                )}
              </div>
              <p className="m-0 whitespace-pre-line text-base leading-[1.6] text-[#2C2C36]">
                {c.content}
              </p>
              {c.reply && (
                <div className="mt-1 border-l-2 border-marine pl-3.5 text-[15px] leading-[1.55] text-encre-douce">
                  <span className="font-bold text-marine">
                    Réponse de la paroisse :{" "}
                  </span>
                  {c.reply}
                </div>
              )}
              {!c.enAttente && (
                <button
                  aria-pressed={!!c.aime}
                  className={`min-h-11 self-start py-0.5 text-sm font-bold sm:min-h-0 ${c.aime ? "text-rouge" : "text-gris"}`}
                  type="button"
                  onClick={() => aimer(c)}
                >
                  J’aime · {c.likes_count}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
