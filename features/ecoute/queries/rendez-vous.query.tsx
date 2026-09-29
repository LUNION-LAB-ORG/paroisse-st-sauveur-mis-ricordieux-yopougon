"use client";

import type { IRendezVousModifier } from "../types/rendez-vous.type";

import { toast } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { rendezVousAPI } from "../apis/rendez-vous.api";

import { ecouteKeyQuery, useInvalidateEcouteQuery } from "./index.query";

import { messageErreur } from "@/features/admin/utils/reponse-api";

export const useRendezVousQuery = () =>
  useQuery({
    queryKey: ecouteKeyQuery("rendez-vous"),
    queryFn: () => rendezVousAPI.lister(),
    staleTime: 30 * 1000,
  });

export const useModifierRendezVousMutation = () => {
  const invalider = useInvalidateEcouteQuery();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: IRendezVousModifier;
      succes: string;
    }) => rendezVousAPI.modifier(id, data),
    onSuccess: async (_r, v) => {
      toast.success(v.succes);
      await invalider();
    },
    onError: (e) => toast.danger(messageErreur(e)),
  });
};
