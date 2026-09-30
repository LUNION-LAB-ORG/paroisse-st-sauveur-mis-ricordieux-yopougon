"use client";

import type {
  IEvenementAdmin,
  IEvenementSaisie,
} from "../types/evenement-admin.type";

import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";

import { evenementAdminAPI } from "../apis/evenement-admin.api";

import { useInvalidateEvenementQuery } from "./index.query";

import { messageErreur } from "@/components/admin/contenus/erreur-api";

const echec = (err: unknown) => toast.danger(messageErreur(err));

/** Création / mise à jour, puis envoi de l'affiche éventuelle. */
export const useEnregistrerEvenementMutation = () => {
  const invalider = useInvalidateEvenementQuery();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      affiche,
    }: {
      id?: number;
      data: IEvenementSaisie;
      affiche?: File | null;
    }): Promise<{ evenement: IEvenementAdmin; erreurAffiche?: string }> => {
      const res = id
        ? await evenementAdminAPI.modifier(id, data)
        : await evenementAdminAPI.ajouter(data);
      let evenement = res.data;
      let erreurAffiche: string | undefined;

      if (affiche && evenement?.id) {
        try {
          evenement =
            (await evenementAdminAPI.changerAffiche(evenement.id, affiche))
              .data ?? evenement;
        } catch (err) {
          erreurAffiche = messageErreur(err);
        }
      }

      return { evenement, erreurAffiche };
    },
    onSuccess: async ({ erreurAffiche }, { id }) => {
      await invalider("admin");
      toast.success(id ? "Événement enregistré." : "Événement créé.");
      if (erreurAffiche)
        toast.danger(`L’affiche n’a pas été envoyée : ${erreurAffiche}`);
    },
    onError: echec,
  });
};

export const useSupprimerEvenementAdminMutation = () => {
  const invalider = useInvalidateEvenementQuery();

  return useMutation({
    mutationFn: (id: number) => evenementAdminAPI.supprimer(id),
    onSuccess: async () => {
      await invalider("admin");
      toast.success("Événement supprimé.");
    },
    onError: echec,
  });
};
