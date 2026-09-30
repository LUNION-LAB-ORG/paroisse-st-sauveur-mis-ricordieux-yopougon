"use client";

import { useQuery } from "@tanstack/react-query";

import { liturgieAPI } from "../apis/liturgie.api";

import { liturgieKeyQuery } from "./index.query";

export const useJoursLiturgiquesQuery = (from: string, to: string) =>
  useQuery({
    queryKey: liturgieKeyQuery("jours", from, to),
    queryFn: async () => (await liturgieAPI.jours(from, to)).data ?? [],
    staleTime: 60 * 1000,
  });

export const useHomeliesQuery = () =>
  useQuery({
    queryKey: liturgieKeyQuery("homelies"),
    queryFn: async () => (await liturgieAPI.homelies()).data ?? [],
    staleTime: 30 * 1000,
  });

export const usePretresQuery = () =>
  useQuery({
    queryKey: liturgieKeyQuery("pretres"),
    queryFn: async () => (await liturgieAPI.pretres()).data ?? [],
    staleTime: 5 * 60 * 1000,
  });
