"use client";

import type { TonPastille } from "@/components/admin/ui/kit";
import type { IPublicationAdmin } from "@/features/publication/apis/publication-admin.api";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { dateCourte } from "@/components/admin/contenus/dates";
import { messageErreur } from "@/components/admin/contenus/erreur-api";
import { LectureSeule } from "@/components/admin/contenus/mise-en-page";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  BoutonAdmin,
  Carte,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
  Filtres,
  Pastille,
  PiedListe,
  TableauAdmin,
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import { useSupprimerPublicationMutation } from "@/features/publication/queries/publication-admin.mutation";
import { usePublicationsAdminQuery } from "@/features/publication/queries/publication-admin.query";

type IFiltre = "toutes" | "published" | "draft" | "hidden";

export const LIBELLES_TYPE: Record<string, string> = {
  photo: "Album photo",
  video: "Vidéo",
  text: "Texte",
};

export function statutPublication(
  p: Pick<IPublicationAdmin, "status" | "published_at">,
): {
  label: string;
  ton: TonPastille;
} {
  if (p.status === "draft") return { label: "Brouillon", ton: "neutre" };
  if (p.status === "hidden") return { label: "Masquée", ton: "neutre" };
  if (
    p.published_at &&
    new Date(`${p.published_at.replace(" ", "T")}Z`).getTime() > Date.now()
  )
    return { label: "Programmée", ton: "info" };

  return { label: "Publiée", ton: "succes" };
}

/** Liste des publications de la page Communauté. */
export function ListePublications() {
  const peutEcrire = useDroits().peutModifier("publications");
  const router = useRouter();
  const publications = usePublicationsAdminQuery();
  const supprimer = useSupprimerPublicationMutation();
  const { confirmer, fenetre } = useConfirmation();
  const [filtre, setFiltre] = useState<IFiltre>("toutes");

  const liste = useMemo(() => publications.data ?? [], [publications.data]);
  const visibles =
    filtre === "toutes" ? liste : liste.filter((p) => p.status === filtre);
  const compte = (s: IFiltre) =>
    s === "toutes" ? liste.length : liste.filter((p) => p.status === s).length;

  const retirer = async (p: IPublicationAdmin) => {
    if (
      await confirmer({
        titre: "Supprimer cette publication ?",
        message: `« ${p.title} » sera retirée de la page Communauté, avec ses commentaires.`,
        libelleConfirmer: "Supprimer",
        danger: true,
      })
    )
      supprimer.mutate(p.id);
  };

  return (
    <>
      {fenetre}
      <EnTeteAdmin
        actions={
          peutEcrire && (
            <BoutonAdmin
              href="/dashboard/publications/nouvelle"
              variante="primaire"
            >
              + Nouvelle publication
            </BoutonAdmin>
          )
        }
        sousTitre="Albums photo, vidéos et textes de la page Communauté"
        titre="Publications"
      />
      <ContenuAdmin>
        <LectureSeule visible={!peutEcrire} />
        <Filtres
          label="Filtrer les publications"
          options={[
            { valeur: "toutes", label: "Toutes", compte: compte("toutes") },
            {
              valeur: "published",
              label: "Publiées",
              compte: compte("published"),
            },
            { valeur: "draft", label: "Brouillons", compte: compte("draft") },
            { valeur: "hidden", label: "Masquées", compte: compte("hidden") },
          ]}
          valeur={filtre}
          onChange={setFiltre}
        />
        {publications.isError ? (
          <ErreurChargement
            message={`Les publications n’ont pas pu être chargées. ${messageErreur(publications.error)}`}
            onReessayer={() => publications.refetch()}
          />
        ) : (
          <Carte className="flex flex-col overflow-hidden">
            <TableauAdmin
              chargement={publications.isLoading}
              cleLigne={(p) => p.id}
              colonnes={[
                {
                  cle: "titre",
                  titre: "Publication",
                  rendu: (p) => (
                    <span className="flex flex-col gap-0.5">
                      <span className="font-bold">{p.title}</span>
                      {p.is_featured && (
                        <span className="text-xs font-bold text-rouge">
                          À la une
                        </span>
                      )}
                    </span>
                  ),
                },
                {
                  cle: "type",
                  titre: "Type",
                  className: "whitespace-nowrap",
                  rendu: (p) => p.format || LIBELLES_TYPE[p.type] || p.type,
                },
                {
                  cle: "categorie",
                  titre: "Catégorie",
                  secondaire: true,
                  rendu: (p) => p.category || "—",
                },
                {
                  cle: "date",
                  titre: "Publication le",
                  secondaire: true,
                  className: "whitespace-nowrap text-gris",
                  rendu: (p) => dateCourte(p.published_at),
                },
                {
                  cle: "reactions",
                  titre: "Réactions",
                  secondaire: true,
                  className: "whitespace-nowrap text-gris",
                  rendu: (p) =>
                    `${p.likes_count} J’aime · ${p.comments_count} comm.`,
                },
                {
                  cle: "statut",
                  titre: "Statut",
                  rendu: (p) => {
                    const s = statutPublication(p);

                    return <Pastille ton={s.ton}>{s.label}</Pastille>;
                  },
                },
                {
                  cle: "actions",
                  titre: <span className="sr-only">Actions</span>,
                  className: "text-right whitespace-nowrap",
                  rendu: (p) => (
                    <span
                      className="inline-flex gap-3"
                      role="presentation"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <Link
                        className="font-bold text-rouge hover:text-rouge-hover"
                        href={`/dashboard/publications/${p.id}`}
                      >
                        {peutEcrire ? "Modifier" : "Voir"}
                      </Link>
                      {peutEcrire && (
                        <button
                          className="font-bold text-gris hover:text-rouge disabled:opacity-50"
                          disabled={supprimer.isPending}
                          type="button"
                          onClick={() => retirer(p)}
                        >
                          Supprimer
                        </button>
                      )}
                    </span>
                  ),
                },
              ]}
              lignes={visibles}
              vide={
                filtre === "toutes"
                  ? "Aucune publication pour le moment."
                  : "Aucune publication dans cette liste."
              }
              onChoisir={(p) => router.push(`/dashboard/publications/${p.id}`)}
            />
            <PiedListe
              droite="Cliquez sur une ligne pour ouvrir l’éditeur"
              gauche={`${visibles.length} publication(s) affichée(s)`}
            />
          </Carte>
        )}
      </ContenuAdmin>
    </>
  );
}
