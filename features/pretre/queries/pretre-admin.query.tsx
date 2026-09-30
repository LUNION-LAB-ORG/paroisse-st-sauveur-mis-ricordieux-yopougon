"use client";

import type { IPretre } from "../types/pretre.type";

import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { pretreAPI } from "../apis/pretre.api";

import { adminAPI } from "@/features/admin/apis/admin.api";
import { messageErreur } from "@/features/admin/utils/reponse-api";

export const pretreKeyQuery = (...params: unknown[]) => ["pretre", ...params];

export const usePretresAdminQuery = () =>
  useQuery({
    queryKey: pretreKeyQuery("admin"),
    queryFn: () => pretreAPI.listerAdmin(),
    select: (r) =>
      [...(r.data ?? [])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id,
      ),
  });

const useInvalider = () => {
  const client = useQueryClient();

  return () => client.invalidateQueries({ queryKey: pretreKeyQuery() });
};

export const useEnregistrerPretreMutation = () => {
  const invalider = useInvalider();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | null; data: FormData }) =>
      id ? pretreAPI.modifier(id, data) : pretreAPI.ajouter(data),
    onSuccess: async (_r, v) => {
      toast.success(v.id ? "Fiche enregistrée" : "Prêtre ajouté à l’équipe");
      await invalider();
    },
  });
};

export const useStatutPretreMutation = () => {
  const invalider = useInvalider();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: IPretre["status"];
      succes: string;
    }) => pretreAPI.changerStatut(id, status),
    onSuccess: async (_r, v) => {
      toast.success(v.succes);
      await invalider();
    },
    onError: (e) => toast.danger(messageErreur(e)),
  });
};

export const useSupprimerPretreMutation = () => {
  const invalider = useInvalider();

  return useMutation({
    mutationFn: (id: number) => pretreAPI.supprimer(id),
    onSuccess: async () => {
      toast.success("Fiche supprimée définitivement");
      await invalider();
    },
    onError: (e) => toast.danger(messageErreur(e)),
  });
};

/** Nouvel ordre d'affichage (optimiste, rétabli en cas d'échec). */
export const useReordonnerPretresMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (ordre: IPretre[]) =>
      adminAPI.reordonner(
        "priests",
        ordre.map((p) => p.id),
      ),
    onMutate: async (ordre) => {
      const cle = pretreKeyQuery("admin");

      await client.cancelQueries({ queryKey: cle });
      const avant = client.getQueryData(cle);

      client.setQueryData(cle, (r: { data: IPretre[] } | undefined) =>
        r ? { ...r, data: ordre.map((p, i) => ({ ...p, sort_order: i })) } : r,
      );

      return { avant };
    },
    onError: (e, _v, ctx) => {
      client.setQueryData(pretreKeyQuery("admin"), ctx?.avant);
      toast.danger(
        messageErreur(e, "Le nouvel ordre n’a pas pu être enregistré."),
      );
    },
    onSuccess: () => toast.success("Ordre d’affichage enregistré"),
    onSettled: () => client.invalidateQueries({ queryKey: pretreKeyQuery() }),
  });
};
