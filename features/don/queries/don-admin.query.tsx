"use client";

import type { IDonCreer } from "../types/don.type";

import { toast } from "@heroui/react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

import { donAdminAPI, type IParamsDons } from "../apis/don-admin.api";

import { donKeyQuery, useInvalidateDonQuery } from "./index.query";

import { messageErreur } from "@/features/admin/utils/reponse-api";

export const useDonsAdminQuery = (params: IParamsDons) =>
  useQuery({
    queryKey: donKeyQuery("admin", params),
    queryFn: () => donAdminAPI.lister(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

export const useSaisirDonMutation = () => {
  const invalider = useInvalidateDonQuery();

  return useMutation({
    mutationFn: (data: IDonCreer & { display_name?: boolean }) =>
      donAdminAPI.saisir(data),
    onSuccess: async () => {
      toast.success("Don enregistré");
      await invalider();
    },
  });
};

export const useModifierDonMutation = () => {
  const invalider = useInvalidateDonQuery();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<IDonCreer>;
      succes: string;
    }) => donAdminAPI.modifier(id, data),
    onSuccess: async (_r, v) => {
      toast.success(v.succes);
      await invalider();
    },
    onError: (e) => toast.danger(messageErreur(e)),
  });
};
