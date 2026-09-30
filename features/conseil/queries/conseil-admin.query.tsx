"use client";

import type { IConseil, IConseilEnregistrer } from "../types/conseil.type";

import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { conseilAPI } from "../apis/conseil.api";

import { adminAPI } from "@/features/admin/apis/admin.api";
import { messageErreur } from "@/features/admin/utils/reponse-api";

export const conseilKeyQuery = (...params: unknown[]) => ["conseil", ...params];

export const useConseilsAdminQuery = () =>
  useQuery({
    queryKey: conseilKeyQuery("admin"),
    queryFn: () => conseilAPI.listerAdmin(),
    select: (r) =>
      [...(r.data ?? [])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id,
      ),
  });

const useInvalider = () => {
  const client = useQueryClient();

  return () => client.invalidateQueries({ queryKey: conseilKeyQuery() });
};

export const useEnregistrerConseilMutation = () => {
  const invalider = useInvalider();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | null;
      data: IConseilEnregistrer;
    }) => (id ? conseilAPI.modifier(id, data) : conseilAPI.ajouter(data)),
    onSuccess: async (_r, v) => {
      toast.success(v.id ? "Conseil enregistré" : "Conseil ajouté");
      await invalider();
    },
  });
};

export const useSupprimerConseilMutation = () => {
  const invalider = useInvalider();

  return useMutation({
    mutationFn: (id: number) => conseilAPI.supprimer(id),
    onSuccess: async () => {
      toast.success("Conseil supprimé");
      await invalider();
    },
    onError: (e) => toast.danger(messageErreur(e)),
  });
};

/** Nouvel ordre d'affichage des conseils sur la page Équipe. */
export const useReordonnerConseilsMutation = () => {
  const invalider = useInvalider();

  return useMutation({
    mutationFn: (ordre: IConseil[]) =>
      adminAPI.reordonner(
        "councils",
        ordre.map((c) => c.id),
      ),
    onSuccess: () => toast.success("Ordre d’affichage enregistré"),
    onError: (e) =>
      toast.danger(
        messageErreur(e, "Le nouvel ordre n’a pas pu être enregistré."),
      ),
    onSettled: invalider,
  });
};
