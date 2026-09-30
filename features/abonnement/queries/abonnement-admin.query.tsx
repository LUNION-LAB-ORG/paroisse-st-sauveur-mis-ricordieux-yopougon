"use client";

import type { IStatutAbonne } from "../types/abonnement-admin.type";

import { toast } from "@heroui/react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { abonnementAdminAPI } from "../apis/abonnement-admin.api";

import { messageErreur } from "@/features/admin/utils/reponse-api";
import { settingAPI } from "@/features/setting/apis/setting.api";

const cle = (...p: unknown[]) => ["abonnement", ...p];

export const useAbonnesQuery = (params: {
  status: IStatutAbonne;
  phone?: string;
  page: number;
}) =>
  useQuery({
    queryKey: cle("liste", params),
    queryFn: () => abonnementAdminAPI.lister(params),
    placeholderData: keepPreviousData,
  });

export const useStatsAbonnesQuery = () =>
  useQuery({
    queryKey: cle("stats"),
    queryFn: () => abonnementAdminAPI.stats(),
  });

/** Paramètres `whatsapp.auto_*` (lus dans la table des paramètres). */
export const useParametresWhatsappQuery = () =>
  useQuery({
    queryKey: cle("parametres"),
    queryFn: () => settingAPI.obtenirMap(),
    select: (r) =>
      Object.fromEntries(
        Object.entries(r.data ?? {}).filter(([k]) => k.startsWith("whatsapp.")),
      ),
  });

export const useModifierEnvoiAutoMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({
      cle: key,
      actif,
    }: {
      cle: string;
      actif: boolean;
      nom: string;
    }) => settingAPI.modifier([{ key, value: actif ? "1" : "0" }]),
    onSuccess: (_r, v) => {
      toast.success(`${v.nom} : ${v.actif ? "actif" : "en pause"}`);
    },
    onError: (e) => toast.danger(messageErreur(e)),
    onSettled: () => client.invalidateQueries({ queryKey: cle("parametres") }),
  });
};
