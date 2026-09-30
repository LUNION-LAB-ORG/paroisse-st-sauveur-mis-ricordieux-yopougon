"use client";

import { useQuery } from "@tanstack/react-query";

import { evenementAdminAPI } from "../apis/evenement-admin.api";

import { evenementKeyQuery } from "./index.query";

export const useEvenementsAdminQuery = (periode: "upcoming" | "past") =>
  useQuery({
    queryKey: evenementKeyQuery("admin", periode),
    queryFn: async () => (await evenementAdminAPI.liste(periode)).data ?? [],
    staleTime: 30 * 1000,
  });

export const useInscritsQuery = (id: number | null) =>
  useQuery({
    queryKey: evenementKeyQuery("admin", "inscrits", id),
    queryFn: () => evenementAdminAPI.inscrits(id as number),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
