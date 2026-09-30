"use client";

import type { ISetting } from "@/features/setting/types/setting.type";

import { useQuery } from "@tanstack/react-query";

import { histoireAPI } from "../apis/histoire.api";

import { histoireKeyQuery } from "./index.query";

import { settingAPI } from "@/features/setting/apis/setting.api";

export const useJalonsAdminQuery = () =>
  useQuery({
    queryKey: histoireKeyQuery("jalons"),
    queryFn: async () =>
      [...((await histoireAPI.jalons()).data ?? [])].sort(
        (a, b) => a.sort_order - b.sort_order || a.id - b.id,
      ),
    staleTime: 30 * 1000,
  });

/** Paramètres de l'écran (histoire, mot du curé), indexés par clé. */
export const useParametresHistoireQuery = () =>
  useQuery({
    queryKey: histoireKeyQuery("parametres"),
    queryFn: async () => {
      const groupes = (await settingAPI.obtenirGroupes()).data ?? {};
      const parCle: Record<string, ISetting> = {};

      Object.values(groupes).forEach((liste) =>
        liste.forEach((s) => {
          parCle[s.key] = s;
        }),
      );

      return parCle;
    },
    staleTime: 30 * 1000,
  });
