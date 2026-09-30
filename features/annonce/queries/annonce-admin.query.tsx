"use client";

import { useQuery } from "@tanstack/react-query";

import { annonceAPI } from "../apis/annonce.api";

import { annonceKeyQuery } from "./index.query";

import { settingAPI } from "@/features/setting/apis/setting.api";

export const useAnnoncesAdminQuery = () =>
  useQuery({
    queryKey: annonceKeyQuery("liste"),
    queryFn: async () => (await annonceAPI.obtenirToutes()).data ?? [],
    staleTime: 30 * 1000,
  });

/** URL de la feuille d'annonces de la semaine (paramètre `announcements.sheet_pdf`). */
export const useFeuilleAnnoncesQuery = () =>
  useQuery({
    queryKey: annonceKeyQuery("feuille"),
    queryFn: async () =>
      ((await settingAPI.obtenirMap()).data ?? {})["announcements.sheet_pdf"] ||
      null,
    staleTime: 60 * 1000,
  });
