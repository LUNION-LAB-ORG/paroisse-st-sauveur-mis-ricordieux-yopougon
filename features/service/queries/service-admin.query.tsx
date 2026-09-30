"use client";

import type { IService } from "../types/service.type";

import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { serviceAPI } from "../apis/service.api";

import { adminAPI } from "@/features/admin/apis/admin.api";
import { messageErreur } from "@/features/admin/utils/reponse-api";

export const serviceKeyQuery = (...params: unknown[]) => ["service", ...params];

export const useServicesAdminQuery = () =>
  useQuery({
    queryKey: serviceKeyQuery("admin"),
    queryFn: () => serviceAPI.obtenirTousAdmin(),
    select: (r) =>
      [...(r.data ?? [])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id,
      ),
  });

const useInvalider = () => {
  const client = useQueryClient();

  return () => client.invalidateQueries({ queryKey: serviceKeyQuery() });
};

export const useEnregistrerServiceMutation = () => {
  const invalider = useInvalider();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | null; data: FormData }) => {
      if (id) data.set("_method", "PUT");

      return id ? serviceAPI.modifier(id, data) : serviceAPI.ajouter(data);
    },
    onSuccess: async (_r, v) => {
      toast.success(v.id ? "Mouvement enregistré" : "Mouvement ajouté");
      await invalider();
    },
  });
};

export const useSupprimerServiceMutation = () => {
  const invalider = useInvalider();

  return useMutation({
    mutationFn: (id: number) => serviceAPI.supprimer(id),
    onSuccess: async () => {
      toast.success("Mouvement supprimé");
      await invalider();
    },
    onError: (e) => toast.danger(messageErreur(e)),
  });
};

/** Nouvel ordre d'affichage (optimiste, rétabli en cas d'échec). */
export const useReordonnerServicesMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (ordre: IService[]) =>
      adminAPI.reordonner(
        "services",
        ordre.map((s) => s.id),
      ),
    onMutate: async (ordre) => {
      const cle = serviceKeyQuery("admin");

      await client.cancelQueries({ queryKey: cle });
      const avant = client.getQueryData(cle);

      client.setQueryData(cle, (r: { data: IService[] } | undefined) =>
        r ? { ...r, data: ordre.map((s, i) => ({ ...s, sort_order: i })) } : r,
      );

      return { avant };
    },
    onError: (e, _v, ctx) => {
      client.setQueryData(serviceKeyQuery("admin"), ctx?.avant);
      toast.danger(
        messageErreur(e, "Le nouvel ordre n’a pas pu être enregistré."),
      );
    },
    onSuccess: () => toast.success("Ordre d’affichage enregistré"),
    onSettled: () => client.invalidateQueries({ queryKey: serviceKeyQuery() }),
  });
};
