"use client";

import type {
  ICommentaireAdmin,
  IPublicationAdmin,
  IPublicationSaisie,
} from "../apis/publication-admin.api";

import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";

import { publicationAdminAPI } from "../apis/publication-admin.api";

import {
  useInvalidateCommentaireQuery,
  useInvalidatePublicationQuery,
} from "./index.query";

import { messageErreur } from "@/components/admin/contenus/erreur-api";

const echec = (err: unknown) => toast.danger(messageErreur(err));

/** Enregistre la publication puis envoie les photos en attente (galerie). */
export const useEnregistrerPublicationMutation = () => {
  const invalider = useInvalidatePublicationQuery();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      photos,
    }: {
      id?: number;
      data: IPublicationSaisie;
      photos: File[];
    }): Promise<{ publication: IPublicationAdmin; photosEnEchec: number }> => {
      const res = id
        ? await publicationAdminAPI.modifier(id, data)
        : await publicationAdminAPI.ajouter(data);
      let publication = res.data;
      let photosEnEchec = 0;

      for (const f of photos) {
        try {
          publication =
            (await publicationAdminAPI.ajouterPhoto(publication.id, f)).data ??
            publication;
        } catch {
          photosEnEchec += 1;
        }
      }

      return { publication, photosEnEchec };
    },
    onSuccess: async ({ photosEnEchec }, { data }) => {
      await invalider();
      toast.success(
        data.status === "published"
          ? "Publication enregistrée et publiée."
          : data.status === "hidden"
            ? "Publication masquée."
            : "Brouillon enregistré.",
      );
      if (photosEnEchec)
        toast.danger(`${photosEnEchec} photo(s) n’ont pas pu être envoyées.`);
    },
    onError: echec,
  });
};

export const useRetirerPhotoMutation = () => {
  const invalider = useInvalidatePublicationQuery();

  return useMutation({
    mutationFn: ({ id, index }: { id: number; index: number }) =>
      publicationAdminAPI.retirerPhoto(id, index),
    onSuccess: async () => {
      await invalider();
      toast.success("Photo retirée de la galerie.");
    },
    onError: echec,
  });
};

export const useSupprimerPublicationMutation = () => {
  const invalider = useInvalidatePublicationQuery();

  return useMutation({
    mutationFn: (id: number) => publicationAdminAPI.supprimer(id),
    onSuccess: async () => {
      await invalider("liste");
      toast.success("Publication supprimée.");
    },
    onError: echec,
  });
};

const MESSAGES_MODERATION: Record<ICommentaireAdmin["status"], string> = {
  published: "Commentaire validé : il est visible sur le site.",
  rejected: "Commentaire refusé.",
  pending: "Commentaire remis en attente.",
};

export const useModererCommentaireMutation = () => {
  const invalider = useInvalidateCommentaireQuery();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { status?: ICommentaireAdmin["status"]; reply?: string | null };
    }) => publicationAdminAPI.modifierCommentaire(id, data),
    onSuccess: async (_r, { data }) => {
      await invalider();
      toast.success(
        data.status
          ? MESSAGES_MODERATION[data.status]
          : data.reply
            ? "Réponse publiée sous le commentaire."
            : "Réponse retirée.",
      );
    },
    onError: echec,
  });
};

export const useSupprimerCommentaireMutation = () => {
  const invalider = useInvalidateCommentaireQuery();

  return useMutation({
    mutationFn: (id: number) => publicationAdminAPI.supprimerCommentaire(id),
    onSuccess: async () => {
      await invalider();
      toast.success("Commentaire supprimé.");
    },
    onError: echec,
  });
};
