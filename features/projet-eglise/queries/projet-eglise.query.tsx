"use client";

import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type IProjetEgliseModifier,
  projetEgliseAPI,
} from "../apis/projet-eglise.api";

import { messageErreur } from "@/features/admin/utils/reponse-api";

export const projetEgliseKeyQuery = (...params: unknown[]) => [
  "projet-eglise",
  ...params,
];

export const useProjetEgliseQuery = () =>
  useQuery({
    queryKey: projetEgliseKeyQuery(),
    queryFn: () => projetEgliseAPI.obtenir(),
  });

const useInvalider = () => {
  const client = useQueryClient();

  return () => client.invalidateQueries({ queryKey: projetEgliseKeyQuery() });
};

export const useModifierProjetEgliseMutation = () => {
  const invalider = useInvalider();

  return useMutation({
    mutationFn: (data: IProjetEgliseModifier) => projetEgliseAPI.modifier(data),
    onSuccess: async () => {
      toast.success("Projet enregistré");
      await invalider();
    },
    onError: (e) => toast.danger(messageErreur(e)),
  });
};

export const useAjouterPhotosChantierMutation = () => {
  const invalider = useInvalider();

  return useMutation({
    mutationFn: async (fichiers: File[]) => {
      for (const f of fichiers) await projetEgliseAPI.ajouterPhoto(f);
    },
    onSuccess: async (_r, fichiers) => {
      toast.success(
        fichiers.length > 1
          ? `${fichiers.length} photos ajoutées à la galerie`
          : "Photo ajoutée à la galerie",
      );
      await invalider();
    },
    onError: async (e) => {
      toast.danger(messageErreur(e, "L’envoi de la photo a échoué."));
      await invalider();
    },
  });
};

export const useRetirerPhotoChantierMutation = () => {
  const invalider = useInvalider();

  return useMutation({
    mutationFn: (index: number) => projetEgliseAPI.retirerPhoto(index),
    onSuccess: async () => {
      toast.success("Photo retirée de la galerie");
      await invalider();
    },
    onError: (e) => toast.danger(messageErreur(e)),
  });
};
