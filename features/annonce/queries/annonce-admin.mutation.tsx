"use client";

import type { IAnnonceSaisie } from "../apis/annonce.api";

import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";

import { annonceAPI } from "../apis/annonce.api";

import { useInvalidateAnnonceQuery } from "./index.query";

import { messageErreur } from "@/components/admin/contenus/erreur-api";
import { settingAPI } from "@/features/setting/apis/setting.api";

const echec = (err: unknown) => toast.danger(messageErreur(err));

const MESSAGES: Record<IAnnonceSaisie["status"], string> = {
  published: "Annonce publiée.",
  draft: "Brouillon de l’annonce enregistré.",
  hidden: "Annonce masquée : elle n’apparaît plus sur le site.",
};

export const useEnregistrerAnnonceMutation = () => {
  const invalider = useInvalidateAnnonceQuery();

  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: IAnnonceSaisie }) =>
      id ? annonceAPI.modifier(id, data) : annonceAPI.ajouter(data),
    onSuccess: async (_r, { data }) => {
      await invalider("liste");
      toast.success(MESSAGES[data.status]);
    },
    onError: echec,
  });
};

export const useSupprimerAnnonceMutation = () => {
  const invalider = useInvalidateAnnonceQuery();

  return useMutation({
    mutationFn: (id: number) => annonceAPI.supprimer(id),
    onSuccess: async () => {
      await invalider("liste");
      toast.success("Annonce supprimée.");
    },
    onError: echec,
  });
};

export const useDeposerFeuilleMutation = () => {
  const invalider = useInvalidateAnnonceQuery();

  return useMutation({
    mutationFn: (fichier: File) =>
      settingAPI.uploadFichier("announcements.sheet_pdf", fichier),
    onSuccess: async () => {
      await invalider("feuille");
      toast.success(
        "Feuille d’annonces déposée : elle est en ligne sur la page Annonces.",
      );
    },
    onError: echec,
  });
};
