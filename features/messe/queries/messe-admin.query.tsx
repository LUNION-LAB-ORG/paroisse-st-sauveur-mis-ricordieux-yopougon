"use client";

import type { ISaisieMesseSecretariat } from "../types/messe-admin.type";

import { toast } from "@heroui/react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

import { type IParamsMesses, messeAdminAPI } from "../apis/messe-admin.api";

import { messeKeyQuery, useInvalidateMesseQuery } from "./index.query";

import { messageErreur } from "@/features/admin/utils/reponse-api";
import { demandeMesseAPI } from "@/features/demande-messe/apis/demande-messe.api";

export const useMessesAdminQuery = (params: IParamsMesses) =>
  useQuery({
    queryKey: messeKeyQuery("admin", params),
    queryFn: () => messeAdminAPI.lister(params),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

export const useListeCelebrantQuery = (date: string) =>
  useQuery({
    queryKey: messeKeyQuery("celebrant", date),
    queryFn: () => messeAdminAPI.listeCelebrant(date),
    enabled: !!date,
  });

/** Créneaux disponibles (même source que la page publique « Demander une messe »). */
export const useDisponibilitesMesseQuery = (from: string, actif = true) =>
  useQuery({
    queryKey: messeKeyQuery("disponibilites", from),
    queryFn: () => demandeMesseAPI.disponibilites(from, 31),
    enabled: actif && !!from,
    staleTime: 60 * 1000,
  });

export const useModifierDemandeMesseMutation = () => {
  const invalider = useInvalidateMesseQuery();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Parameters<typeof messeAdminAPI.modifier>[1];
      succes: string;
    }) => messeAdminAPI.modifier(id, data),
    onSuccess: async (_r, v) => {
      toast.success(v.succes);
      await invalider();
    },
    onError: (e) => toast.danger(messageErreur(e)),
  });
};

export const useDeplacerMesseMutation = () => {
  const invalider = useInvalidateMesseQuery();

  return useMutation({
    mutationFn: ({
      scheduleId,
      data,
    }: {
      scheduleId: number;
      data: { date: string; time_slot_id: number };
    }) => messeAdminAPI.deplacer(scheduleId, data),
    onSuccess: async () => {
      toast.success("Messe déplacée");
      await invalider();
    },
    onError: (e) => toast.danger(messageErreur(e, "Le déplacement a échoué.")),
  });
};

export const useSaisirMesseMutation = () => {
  const invalider = useInvalidateMesseQuery();

  return useMutation({
    mutationFn: (data: ISaisieMesseSecretariat) => messeAdminAPI.saisir(data),
    onSuccess: async (r) => {
      toast.success(
        r?.data?.number
          ? `Demande ${r.data.number} enregistrée`
          : "Demande enregistrée",
      );
      await invalider();
    },
  });
};
