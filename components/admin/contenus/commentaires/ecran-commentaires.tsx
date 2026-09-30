"use client";

import type { ICommentaireAdmin } from "@/features/publication/apis/publication-admin.api";

import Link from "next/link";
import { useState } from "react";

import { quand } from "@/components/admin/contenus/dates";
import { messageErreur } from "@/components/admin/contenus/erreur-api";
import { LectureSeule } from "@/components/admin/contenus/mise-en-page";
import { ChampZoneRiche } from "@/components/admin/contenus/champ-zone";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  Avertissement,
  BoutonAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  Encart,
  ErreurChargement,
  Filtres,
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import {
  useModererCommentaireMutation,
  useSupprimerCommentaireMutation,
} from "@/features/publication/queries/publication-admin.mutation";
import {
  useCommentairesQuery,
  useNombreCommentairesQuery,
} from "@/features/publication/queries/publication-admin.query";

type IStatut = ICommentaireAdmin["status"];

function Commentaire({
  c,
  peutEcrire,
}: {
  c: ICommentaireAdmin;
  peutEcrire: boolean;
}) {
  const moderer = useModererCommentaireMutation();
  const supprimer = useSupprimerCommentaireMutation();
  const { confirmer, fenetre } = useConfirmation();
  const [repondre, setRepondre] = useState(false);
  const [reponse, setReponse] = useState(c.reply ?? "");
  const [erreur, setErreur] = useState<string>();
  const enCours = moderer.isPending || supprimer.isPending;
  const masque = c.content.includes("[masqué]");

  const changer = (status: IStatut) =>
    moderer.mutate({ id: c.id, data: { status } });

  const publierReponse = () => {
    if (reponse.trim().length > 2000) {
      setErreur("2 000 caractères au maximum.");

      return;
    }
    if (!reponse.trim() && !c.reply) {
      setErreur("Saisissez votre réponse.");

      return;
    }
    setErreur(undefined);
    moderer.mutate(
      { id: c.id, data: { reply: reponse.trim() || null } },
      { onSuccess: () => setRepondre(false) },
    );
  };

  return (
    <article className="grid grid-cols-[40px_minmax(0,1fr)] gap-3.5 rounded-admin border border-bord-admin bg-white px-4 py-[18px] md:grid-cols-[44px_minmax(0,1fr)_auto] md:px-[22px]">
      {fenetre}
      <div
        aria-hidden
        className="flex size-10 items-center justify-center rounded-full bg-[#E3E6F3] font-bold text-marine"
      >
        {c.initial || c.author.charAt(0).toUpperCase()}
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <span className="text-[15px] font-bold">{c.author}</span>
          <span className="text-[13px] text-gris">
            {quand(c.created_at)}
            {c.publication && (
              <>
                {" · sur "}
                <Link
                  className="text-rouge hover:text-rouge-hover"
                  href={`/dashboard/publications/${c.publication.id}`}
                >
                  {c.publication.title}
                </Link>
              </>
            )}
          </span>
        </div>
        <p className="m-0 whitespace-pre-line break-words text-[15px] leading-[1.55]">
          {c.content}
        </p>
        {masque && (
          <Avertissement className="self-start px-2 py-[3px] text-xs">
            Contient un lien ou un numéro de téléphone : masqué automatiquement
          </Avertissement>
        )}
        {c.reply && !repondre && (
          <Encart className="mt-1" titre="Réponse de la paroisse">
            <span className="whitespace-pre-line">{c.reply}</span>
          </Encart>
        )}
        {repondre && (
          <div className="mt-1 flex flex-col gap-2">
            <ChampZoneRiche
              compteur
              aide="Visible sous le commentaire une fois celui-ci publié."
              erreur={erreur}
              isDisabled={enCours}
              label="Votre réponse"
              maxLength={2000}
              rows={3}
              value={reponse}
              onChange={setReponse}
            />
            <div className="flex flex-wrap gap-2">
              <BoutonAdmin
                className="min-h-9 px-3.5 py-[9px] text-[13px]"
                isPending={moderer.isPending}
                variante="marine"
                onPress={publierReponse}
              >
                {reponse.trim() ? "Publier la réponse" : "Retirer la réponse"}
              </BoutonAdmin>
              <BoutonAdmin
                className="min-h-9 px-3.5 py-[9px] text-[13px]"
                isDisabled={enCours}
                variante="neutre"
                onPress={() => {
                  setRepondre(false);
                  setReponse(c.reply ?? "");
                  setErreur(undefined);
                }}
              >
                Annuler
              </BoutonAdmin>
            </div>
          </div>
        )}
      </div>
      {peutEcrire && (
        <div className="col-span-2 flex flex-wrap items-start gap-2 md:col-span-1 md:justify-end">
          {c.status !== "published" && (
            <button
              className="min-h-9 rounded-admin bg-succes px-3.5 py-[9px] text-[13px] font-bold text-white hover:brightness-110 disabled:opacity-50"
              disabled={enCours}
              type="button"
              onClick={() => changer("published")}
            >
              Valider
            </button>
          )}
          {c.status !== "rejected" && (
            <button
              className="min-h-9 rounded-admin border border-[#E8C4CB] bg-white px-3.5 py-[9px] text-[13px] font-bold text-rouge hover:bg-[#FBEAED] disabled:opacity-50"
              disabled={enCours}
              type="button"
              onClick={() => changer("rejected")}
            >
              {c.status === "published" ? "Retirer" : "Refuser"}
            </button>
          )}
          {c.status !== "rejected" && !repondre && (
            <button
              className="min-h-9 rounded-admin border border-champ bg-white px-3.5 py-[9px] text-[13px] font-semibold hover:bg-entete-admin disabled:opacity-50"
              disabled={enCours}
              type="button"
              onClick={() => setRepondre(true)}
            >
              {c.reply ? "Modifier la réponse" : "Répondre"}
            </button>
          )}
          {c.status === "rejected" && (
            <button
              className="min-h-9 rounded-admin border border-champ bg-white px-3.5 py-[9px] text-[13px] font-semibold text-rouge hover:bg-[#FBEAED] disabled:opacity-50"
              disabled={enCours}
              type="button"
              onClick={async () => {
                if (
                  await confirmer({
                    titre: "Supprimer ce commentaire ?",
                    message: `Le commentaire de ${c.author} sera définitivement retiré de la modération.`,
                    libelleConfirmer: "Supprimer",
                    danger: true,
                  })
                )
                  supprimer.mutate(c.id);
              }}
            >
              Supprimer
            </button>
          )}
        </div>
      )}
    </article>
  );
}

/** Écran « Modération des commentaires ». */
export function EcranCommentaires() {
  const peutEcrire = useDroits().peutModifier("commentaires");
  const [onglet, setOnglet] = useState<IStatut>("pending");
  const liste = useCommentairesQuery(onglet);
  const enAttente = useNombreCommentairesQuery("pending");
  const publies = useNombreCommentairesQuery("published");
  const refuses = useNombreCommentairesQuery("rejected");
  const n = (q: { data?: number }) => (q.data === undefined ? "…" : q.data);

  const commentaires = liste.data?.data ?? [];
  const total = liste.data?.meta?.total ?? commentaires.length;

  return (
    <>
      <EnTeteAdmin
        actions={
          <Filtres
            label="Statut des commentaires"
            options={[
              { valeur: "pending", label: `En attente (${n(enAttente)})` },
              { valeur: "published", label: `Publiés (${n(publies)})` },
              { valeur: "rejected", label: `Refusés (${n(refuses)})` },
            ]}
            valeur={onglet}
            onChange={setOnglet}
          />
        }
        sousTitre="Un commentaire n’apparaît sur le site qu’après validation"
        titre="Modération des commentaires"
      />
      <ContenuAdmin className="max-w-[980px] gap-3.5">
        <LectureSeule visible={!peutEcrire} />
        {liste.isError ? (
          <ErreurChargement
            message={`Les commentaires n’ont pas pu être chargés. ${messageErreur(liste.error)}`}
            onReessayer={() => liste.refetch()}
          />
        ) : liste.isLoading ? (
          <div className="rounded-admin border border-bord-admin bg-white p-10 text-center text-base text-gris">
            Chargement des commentaires…
          </div>
        ) : commentaires.length === 0 ? (
          <div className="rounded-admin border border-bord-admin bg-white p-10 text-center text-base text-gris">
            Aucun commentaire dans cette liste.
          </div>
        ) : (
          <>
            {commentaires.map((c) => (
              <Commentaire key={c.id} c={c} peutEcrire={peutEcrire} />
            ))}
            {total > commentaires.length && (
              <p className="m-0 text-center text-[13px] text-gris">
                {commentaires.length} commentaires affichés sur {total} (les
                plus récents).
              </p>
            )}
          </>
        )}
      </ContenuAdmin>
    </>
  );
}
